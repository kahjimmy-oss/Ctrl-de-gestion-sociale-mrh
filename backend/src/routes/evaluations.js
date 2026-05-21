const express = require('express');
const router = express.Router();
const Evaluation = require('../models/Evaluation');
const Progress = require('../models/Progress');
const User = require('../models/User');
const { protect, studentOnly } = require('../middleware/auth');
const { notifyInstructor, emitToUser } = require('../services/notificationService');

router.get('/', protect, async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === 'student') filter.etudiantId = req.user._id;
    if (req.query.seance) filter.seance = parseInt(req.query.seance);

    const evals = await Evaluation.find(filter)
      .populate('etudiantId', 'name prenom email')
      .sort({ seance: 1 });

    res.json({ success: true, data: evals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/seance/:seance', protect, async (req, res) => {
  try {
    const seance = parseInt(req.params.seance);
    const evaluation = await Evaluation.findOne({ etudiantId: req.user._id, seance });

    if (!evaluation) {
      return res.status(404).json({ success: false, message: 'Évaluation introuvable.' });
    }

    if (!evaluation.accessible && req.user.role === 'student') {
      return res.status(403).json({
        success: false,
        message: 'Cette évaluation n\'est pas encore accessible. Complétez et faites valider vos missions en collectif.'
      });
    }

    res.json({ success: true, data: evaluation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/seance/:seance/start', protect, studentOnly, async (req, res) => {
  try {
    const seance = parseInt(req.params.seance);
    const evaluation = await Evaluation.findOne({ etudiantId: req.user._id, seance });

    if (!evaluation) return res.status(404).json({ success: false, message: 'Évaluation introuvable.' });
    if (!evaluation.accessible) return res.status(403).json({ success: false, message: 'Évaluation non accessible.' });
    if (evaluation.status === 'soumise' || evaluation.status === 'corrigee') {
      return res.status(400).json({ success: false, message: 'Évaluation déjà soumise.' });
    }

    evaluation.status = 'en_cours';
    evaluation.debuteLe = new Date();
    await evaluation.save();

    res.json({ success: true, data: evaluation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/seance/:seance/submit', protect, studentOnly, async (req, res) => {
  try {
    const seance = parseInt(req.params.seance);
    const { reponses } = req.body;

    const evaluation = await Evaluation.findOne({ etudiantId: req.user._id, seance });
    if (!evaluation) return res.status(404).json({ success: false, message: 'Évaluation introuvable.' });
    if (!evaluation.accessible) return res.status(403).json({ success: false, message: 'Évaluation non accessible.' });
    if (evaluation.status === 'soumise' || evaluation.status === 'corrigee') {
      return res.status(400).json({ success: false, message: 'Déjà soumise.' });
    }

    evaluation.questions = reponses || [];
    evaluation.status = 'soumise';
    evaluation.soumisLe = new Date();
    if (evaluation.debuteLe) {
      evaluation.dureeSecondes = Math.round((new Date() - evaluation.debuteLe) / 1000);
    }
    await evaluation.save();

    const instructor = await User.findOne({ role: 'instructor' });
    if (instructor) {
      await notifyInstructor(instructor._id, 'evaluation:submitted', {
        studentName: `${req.user.prenom} ${req.user.name}`,
        seance,
        evaluationId: evaluation._id,
        timestamp: new Date()
      });
    }

    res.json({ success: true, data: evaluation, message: 'Évaluation soumise ! Le formateur va la corriger.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
