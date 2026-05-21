const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Progress = require('../models/Progress');
const Evaluation = require('../models/Evaluation');
const { protect } = require('../middleware/auth');

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '24h' });

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email et mot de passe requis.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Compte désactivé. Contactez votre formateur.' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = signToken(user._id);

    res.json({
      success: true,
      token,
      user: user.toSafeObject()
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { email, password, name, prenom, groupe, registrationCode } = req.body;

    if (registrationCode !== process.env.REGISTRATION_CODE && registrationCode !== 'COSMETICA2024') {
      return res.status(403).json({ success: false, message: 'Code d\'inscription invalide. Contactez votre formateur.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Un compte avec cet email existe déjà.' });
    }

    const user = await User.create({ email, password, name, prenom, groupe: groupe || 'Master RH 1', role: 'student' });

    const Mission = require('../models/Mission');
    const allMissions = await Mission.find({ status: 'publiee' }).sort({ seance: 1, ordre: 1 });

    await Progress.create({
      etudiantId: user._id,
      seanceActive: 1,
      progressionGlobale: 0,
      seances: [1, 2, 3, 4].map(n => ({
        numero: n, debloquee: n === 1, commencee: false,
        completee: false, progressionPct: 0, evaluationPassee: false
      })),
      missions: allMissions.map(m => ({
        missionId: m._id,
        status: m.seance === 1 && m.ordre === 1 ? 'active' : 'verrouillee',
        debloqueLe: m.seance === 1 && m.ordre === 1 ? new Date() : null,
        tentatives: 0
      })),
      questions: [],
      scoreTotal: 0,
      badges: []
    });

    for (const seance of [1, 2, 3, 4]) {
      await Evaluation.create({ etudiantId: user._id, seance, status: 'non_commence', accessible: seance === 1, questions: [] });
    }

    const token = signToken(user._id);
    res.status(201).json({ success: true, token, user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/me', protect, async (req, res) => {
  res.json({ success: true, user: req.user.toSafeObject() });
});

router.patch('/me', protect, async (req, res) => {
  try {
    const { name, prenom, notificationPreferences } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (prenom) updates.prenom = prenom;
    if (notificationPreferences) updates.notificationPreferences = notificationPreferences;

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    res.json({ success: true, user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
