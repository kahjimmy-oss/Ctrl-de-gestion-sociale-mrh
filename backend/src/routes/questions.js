const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const Progress = require('../models/Progress');
const Mission = require('../models/Mission');
const { protect } = require('../middleware/auth');
const { emitToUser } = require('../services/notificationService');

router.get('/seance/:seance', protect, async (req, res) => {
  try {
    const { seance } = req.params;
    const { categorie } = req.query;
    const filter = { seance: parseInt(seance) };
    if (categorie) filter.categorie = categorie;

    const questions = await Question.find(filter).select('-variations.options.correct');
    res.json({ success: true, data: questions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id/variation', protect, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ success: false, message: 'Question introuvable.' });

    const progress = await Progress.findOne({ etudiantId: req.user._id });
    const qp = progress?.questions?.find(q => q.questionId.toString() === question._id.toString());

    if (qp?.repondue && qp?.correcte) {
      return res.json({ success: true, alreadyAnswered: true, correct: true });
    }

    const variation = question.getRandomVariation();
    const safeVariation = {
      ...variation,
      options: variation.options?.map(opt => ({
        id: opt.id,
        texte: opt.texte
      }))
    };

    res.json({
      success: true,
      data: {
        _id: question._id,
        type: question.type,
        enonce: question.enonce,
        contexte: question.contexte,
        sujet: question.sujet,
        difficulte: question.difficulte,
        pointsMax: question.pointsMax,
        tempsLimiteSecondes: question.tempsLimiteSecondes,
        variation: safeVariation,
        donneesNumeriques: question.donneesNumeriques
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/:id/answer', protect, async (req, res) => {
  try {
    const { reponse, variationIndex, tempsSecondes } = req.body;
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ success: false, message: 'Question introuvable.' });

    const variation = question.variations[variationIndex || 0];
    if (!variation) return res.status(400).json({ success: false, message: 'Variation invalide.' });

    let correct = false;
    let feedback = '';
    let pointsGagnes = 0;

    if (question.type === 'qcm' || question.type === 'vrai_faux') {
      const selectedOption = variation.options.find(o => o.id === reponse);
      correct = selectedOption?.correct || false;
      feedback = selectedOption?.feedback || '';
      pointsGagnes = correct ? question.pointsMax : 0;
    } else if (question.type === 'qcm_multiple') {
      const selectedIds = Array.isArray(reponse) ? reponse : [reponse];
      const correctIds = variation.options.filter(o => o.correct).map(o => o.id);
      correct = selectedIds.length === correctIds.length && selectedIds.every(id => correctIds.includes(id));
      const partialPoints = variation.options.filter(o => o.correct && selectedIds.includes(o.id)).length;
      pointsGagnes = Math.round((partialPoints / correctIds.length) * question.pointsMax);
      feedback = variation.options.filter(o => selectedIds.includes(o.id)).map(o => o.feedback).join(' | ');
    } else if (['ouverte', 'calcul', 'analyse_cas'].includes(question.type)) {
      correct = true;
      pointsGagnes = 0;
      feedback = variation.explicationComplete;
    }

    const progress = await Progress.findOne({ etudiantId: req.user._id });
    if (progress) {
      const qpIdx = progress.questions.findIndex(q => q.questionId.toString() === question._id.toString());
      if (qpIdx >= 0) {
        progress.questions[qpIdx].nbTentatives += 1;
        if (correct && !progress.questions[qpIdx].correcte) {
          progress.questions[qpIdx].correcte = true;
          progress.questions[qpIdx].repondue = true;
          progress.questions[qpIdx].pointsGagnes = pointsGagnes;
          progress.questions[qpIdx].repondueLeDate = new Date();
          progress.scoreTotal = (progress.scoreTotal || 0) + pointsGagnes;
        }
      } else {
        progress.questions.push({
          questionId: question._id,
          repondue: true,
          correcte: correct,
          nbTentatives: 1,
          variationUtilisee: variationIndex || 0,
          repondueLeDate: new Date(),
          pointsGagnes: correct ? pointsGagnes : 0
        });
        if (correct) progress.scoreTotal = (progress.scoreTotal || 0) + pointsGagnes;
      }

      if (correct && question.debloqueMissionId) {
        const mIdx = progress.missions.findIndex(m => m.missionId.toString() === question.debloqueMissionId.toString());
        if (mIdx >= 0 && progress.missions[mIdx].status === 'verrouillee') {
          progress.missions[mIdx].status = 'active';
          progress.missions[mIdx].debloqueLe = new Date();
          emitToUser(req.user._id.toString(), 'mission:unlocked', {
            missionId: question.debloqueMissionId,
            message: 'Bonne réponse ! Une nouvelle mission est débloquée.'
          });
        }
      }

      progress.derniereActivite = new Date();
      await progress.save();
    }

    question.statistiques.nbReponses = (question.statistiques.nbReponses || 0) + 1;
    if (correct) question.statistiques.nbCorrectes = (question.statistiques.nbCorrectes || 0) + 1;
    question.statistiques.tauxReussite = Math.round((question.statistiques.nbCorrectes / question.statistiques.nbReponses) * 100);
    await question.save();

    res.json({
      success: true,
      data: {
        correct,
        feedback,
        explicationComplete: correct ? variation.explicationComplete : null,
        pointsGagnes,
        scoreTotal: progress?.scoreTotal
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
