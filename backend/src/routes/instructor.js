const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Submission = require('../models/Submission');
const Evaluation = require('../models/Evaluation');
const Progress = require('../models/Progress');
const Mission = require('../models/Mission');
const { protect, instructorOnly } = require('../middleware/auth');
const { emitToUser } = require('../services/notificationService');

router.use(protect, instructorOnly);

router.get('/dashboard', async (req, res) => {
  try {
    const students = await User.find({ role: 'student', isActive: true }).select('-password');
    const progresses = await Progress.find({}).populate('etudiantId', 'name prenom email');

    const pendingSubmissions = await Submission.find({ status: 'soumise' })
      .populate('etudiantId', 'name prenom')
      .populate('missionId', 'titre seance')
      .sort({ soumisLe: 1 });

    const pendingEvals = await Evaluation.find({ status: 'soumise' })
      .populate('etudiantId', 'name prenom')
      .sort({ soumisLe: 1 });

    const studentsData = students.map(s => {
      const prog = progresses.find(p => p.etudiantId?._id?.toString() === s._id.toString());
      return {
        ...s.toSafeObject(),
        progression: prog?.progressionGlobale || 0,
        seanceActive: prog?.seanceActive || 1,
        scoreTotal: prog?.scoreTotal || 0,
        badges: prog?.badges || [],
        derniereActivite: prog?.derniereActivite
      };
    });

    const alertes = [
      ...pendingSubmissions.map(s => ({
        type: 'submission',
        id: s._id,
        studentName: `${s.etudiantId?.prenom} ${s.etudiantId?.nom || s.etudiantId?.name}`,
        missionTitle: s.missionId?.titre,
        seance: s.missionId?.seance,
        date: s.soumisLe,
        urgence: 'normale'
      })),
      ...pendingEvals.map(e => ({
        type: 'evaluation',
        id: e._id,
        studentName: `${e.etudiantId?.prenom} ${e.etudiantId?.nom || e.etudiantId?.name}`,
        seance: e.seance,
        date: e.soumisLe,
        urgence: 'haute'
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      success: true,
      data: {
        students: studentsData,
        alertes,
        stats: {
          totalEtudiantes: students.length,
          submissionsEnAttente: pendingSubmissions.length,
          evaluationsACorreger: pendingEvals.length,
          progressionMoyenne: Math.round(studentsData.reduce((acc, s) => acc + s.progression, 0) / (studentsData.length || 1))
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/submissions', async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.seance) filter.seance = parseInt(req.query.seance);

    const submissions = await Submission.find(filter)
      .populate('etudiantId', 'name prenom email groupe')
      .populate('missionId', 'titre seance ordre deliverables')
      .sort({ soumisLe: -1 });

    res.json({ success: true, data: submissions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/submissions/:id/validate', async (req, res) => {
  try {
    const { status, feedbackFormateur, scoreQualite, annotations } = req.body;

    const validStatuses = ['approuvee', 'approuvee_partielle', 'a_retravailler'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Statut de validation invalide.' });
    }

    const submission = await Submission.findById(req.params.id).populate('missionId').populate('etudiantId');
    if (!submission) return res.status(404).json({ success: false, message: 'Soumission introuvable.' });

    submission.status = status;
    submission.feedbackFormateur = feedbackFormateur;
    submission.scoreQualite = scoreQualite;
    if (annotations) submission.annotations = annotations;
    submission.valideLe = new Date();
    submission.valideParId = req.user._id;
    submission.alerteFormateurVue = true;

    submission.historiqueVersions.push({
      version: submission.tentative,
      soumisLe: submission.soumisLe,
      status,
      feedback: feedbackFormateur
    });

    await submission.save();

    if (status === 'approuvee' || status === 'approuvee_partielle') {
      const progress = await Progress.findOne({ etudiantId: submission.etudiantId._id });
      if (progress) {
        const mIdx = progress.missions.findIndex(m => m.missionId.toString() === submission.missionId._id.toString());
        if (mIdx >= 0) {
          progress.missions[mIdx].status = 'completee';
          progress.missions[mIdx].completeLe = new Date();
        }

        const nextMission = await Mission.findOne({
          seance: submission.missionId.seance,
          ordre: submission.missionId.ordre + 1,
          status: 'publiee'
        });

        if (nextMission) {
          const nextIdx = progress.missions.findIndex(m => m.missionId.toString() === nextMission._id.toString());
          if (nextIdx >= 0 && progress.missions[nextIdx].status === 'verrouillee') {
            progress.missions[nextIdx].status = 'active';
            progress.missions[nextIdx].debloqueLe = new Date();

            emitToUser(submission.etudiantId._id.toString(), 'mission:unlocked', {
              missionId: nextMission._id,
              missionTitle: nextMission.titre,
              message: `Bravo ! Votre formateur a validé votre travail. Nouvelle mission débloquée : ${nextMission.titre}`
            });
          }
        }

        const seanceEval = await require('../models/Evaluation').findOne({
          etudiantId: submission.etudiantId._id,
          seance: submission.missionId.seance
        });
        if (seanceEval && !seanceEval.accessible) {
          seanceEval.accessible = true;
          await seanceEval.save();
          emitToUser(submission.etudiantId._id.toString(), 'evaluation:unlocked', {
            seance: submission.missionId.seance,
            message: 'L\'évaluation individuelle de cette séance est maintenant accessible !'
          });
        }

        const missionPoints = submission.missionId.pointsRecompense || 0;
        progress.scoreTotal = (progress.scoreTotal || 0) + missionPoints;
        if (submission.missionId.badge && !progress.badges.includes(submission.missionId.badge)) {
          progress.badges.push(submission.missionId.badge);
          emitToUser(submission.etudiantId._id.toString(), 'badge:earned', {
            badge: submission.missionId.badge,
            message: `🏅 Nouveau badge obtenu : ${submission.missionId.badge} !`
          });
        }

        await progress.save();
      }
    }

    emitToUser(submission.etudiantId._id.toString(), 'submission:validated', {
      submissionId: submission._id,
      status,
      feedback: feedbackFormateur,
      message: status === 'approuvee'
        ? '✅ Votre formateur a validé votre travail. Bravo !'
        : status === 'approuvee_partielle'
        ? '✅ Travail partiellement validé. Vérifiez le retour de votre formateur.'
        : '⚠️ Votre formateur vous demande de retravailler ce livrable. Lisez son retour.'
    });

    res.json({ success: true, data: submission });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/evaluations', async (req, res) => {
  try {
    const filter = {};
    if (req.query.seance) filter.seance = parseInt(req.query.seance);
    if (req.query.status) filter.status = req.query.status;

    const evals = await Evaluation.find(filter)
      .populate('etudiantId', 'name prenom email')
      .sort({ seance: 1, soumisLe: -1 });

    res.json({ success: true, data: evals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/evaluations/:id/grade', async (req, res) => {
  try {
    const { noteFinale, commentaireGlobal, criteres, questionsGradees } = req.body;

    const evaluation = await Evaluation.findById(req.params.id).populate('etudiantId');
    if (!evaluation) return res.status(404).json({ success: false, message: 'Évaluation introuvable.' });

    evaluation.noteFinale = noteFinale;
    evaluation.commentaireGlobal = commentaireGlobal;
    if (criteres) evaluation.criteres = criteres;
    if (questionsGradees) evaluation.questions = questionsGradees;
    evaluation.status = 'corrigee';
    evaluation.corrigeLe = new Date();
    evaluation.corrigeParId = req.user._id;
    await evaluation.save();

    const progress = await Progress.findOne({ etudiantId: evaluation.etudiantId._id });
    if (progress) {
      const seanceData = progress.seances.find(s => s.numero === evaluation.seance);
      if (seanceData) {
        seanceData.evaluationPassee = true;
        seanceData.noteEvaluation = noteFinale;
      }
      await progress.save();
    }

    emitToUser(evaluation.etudiantId._id.toString(), 'evaluation:graded', {
      seance: evaluation.seance,
      noteFinale,
      message: `📊 Votre évaluation de la séance ${evaluation.seance} a été corrigée. Note : ${noteFinale}/20`
    });

    res.json({ success: true, data: evaluation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/students/:studentId/unlock-seance', async (req, res) => {
  try {
    const { seance } = req.body;
    const progress = await Progress.findOne({ etudiantId: req.params.studentId });
    if (!progress) return res.status(404).json({ success: false, message: 'Progression introuvable.' });

    const seanceData = progress.seances.find(s => s.numero === seance);
    if (seanceData) {
      seanceData.debloquee = true;
    }
    progress.seanceActive = Math.max(progress.seanceActive, seance);

    const missions = await Mission.find({ seance, status: 'publiee' }).sort({ ordre: 1 });
    if (missions.length > 0) {
      const firstMission = missions[0];
      const mIdx = progress.missions.findIndex(m => m.missionId.toString() === firstMission._id.toString());
      if (mIdx >= 0 && progress.missions[mIdx].status === 'verrouillee') {
        progress.missions[mIdx].status = 'active';
        progress.missions[mIdx].debloqueLe = new Date();
      }
    }

    await progress.save();

    emitToUser(req.params.studentId, 'seance:unlocked', {
      seance,
      message: `🎯 La séance ${seance} est maintenant accessible !`
    });

    res.json({ success: true, message: `Séance ${seance} débloquée pour l'étudiante.` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/analytics', async (req, res) => {
  try {
    const students = await User.find({ role: 'student' });
    const progresses = await Progress.find({});
    const evaluations = await Evaluation.find({ status: 'corrigee' });
    const submissions = await Submission.find({});

    const notesMoyennes = [1, 2, 3, 4].map(seance => {
      const seanceEvals = evaluations.filter(e => e.seance === seance && e.noteFinale !== undefined);
      const moyenne = seanceEvals.length > 0
        ? Math.round(seanceEvals.reduce((acc, e) => acc + e.noteFinale, 0) / seanceEvals.length * 10) / 10
        : null;
      return { seance, moyenne, nbEtudiantes: seanceEvals.length };
    });

    const submissionStats = {
      total: submissions.length,
      approuvees: submissions.filter(s => s.status === 'approuvee').length,
      enAttente: submissions.filter(s => s.status === 'soumise').length,
      aRetravailler: submissions.filter(s => s.status === 'a_retravailler').length
    };

    const progressionMoyenne = progresses.length > 0
      ? Math.round(progresses.reduce((acc, p) => acc + (p.progressionGlobale || 0), 0) / progresses.length)
      : 0;

    res.json({
      success: true,
      data: {
        notesMoyennesParSeance: notesMoyennes,
        submissionStats,
        progressionMoyenne,
        totalEtudiantes: students.length
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
