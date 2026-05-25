const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const Mission = require('../models/Mission');
const Progress = require('../models/Progress');
const User = require('../models/User');
const { protect, studentOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { notifyInstructor } = require('../services/notificationService');
const path = require('path');

router.get('/', protect, async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === 'student') filter.etudiantId = req.user._id;

    const submissions = await Submission.find(filter)
      .populate('missionId', 'titre seance ordre')
      .populate('etudiantId', 'name prenom email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: submissions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/mission/:missionId', protect, async (req, res) => {
  try {
    const filter = { missionId: req.params.missionId };
    if (req.user.role === 'student') filter.etudiantId = req.user._id;

    const submission = await Submission.findOne(filter).populate('missionId').populate('valideParId', 'name prenom');
    res.json({ success: true, data: submission });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', protect, studentOnly, async (req, res) => {
  try {
    const { missionId, groupe } = req.body;
    const mission = await Mission.findById(missionId);
    if (!mission) return res.status(404).json({ success: false, message: 'Mission introuvable.' });

    const existing = await Submission.findOne({ etudiantId: req.user._id, missionId });
    if (existing && existing.status !== 'a_retravailler') {
      return res.json({ success: true, data: existing });
    }

    const submission = await Submission.create({
      etudiantId: req.user._id,
      missionId,
      seance: mission.seance,
      groupe: groupe || req.user.groupe,
      status: 'brouillon',
      fichiers: [],
      tentative: existing ? (existing.tentative + 1) : 1
    });

    res.status(201).json({ success: true, data: submission });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/:id/upload', protect, studentOnly, upload.single('file'), async (req, res) => {
  try {
    const submission = await Submission.findOne({ _id: req.params.id, etudiantId: req.user._id });
    if (!submission) return res.status(404).json({ success: false, message: 'Soumission introuvable.' });

    if (!req.file) return res.status(400).json({ success: false, message: 'Aucun fichier reçu.' });

    const { deliverableId, commentaire } = req.body;
    const fileUrl = `/uploads/${req.user._id}/${req.file.filename}`;

    const existingIdx = submission.fichiers.findIndex(f => f.deliverableId === deliverableId);
    const fileEntry = {
      deliverableId,
      nomFichier: req.file.originalname,
      urlFichier: fileUrl,
      taille: req.file.size,
      type: path.extname(req.file.originalname).slice(1),
      deposeLe: new Date(),
      commentaireEtudiant: commentaire || ''
    };

    if (existingIdx >= 0) {
      submission.fichiers[existingIdx] = fileEntry;
    } else {
      submission.fichiers.push(fileEntry);
    }

    await submission.save();
    res.json({ success: true, data: { file: fileEntry, submission } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/:id/submit', protect, studentOnly, async (req, res) => {
  try {
    const submission = await Submission.findOne({ _id: req.params.id, etudiantId: req.user._id })
      .populate('missionId', 'titre seance deliverables');

    if (!submission) return res.status(404).json({ success: false, message: 'Soumission introuvable.' });

    const mandatoryDeliverables = submission.missionId.deliverables?.filter(d => d.obligatoire) || [];
    const uploadedIds = submission.fichiers.map(f => f.deliverableId);
    const missing = mandatoryDeliverables.filter(d => !uploadedIds.includes(d.id));

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Documents obligatoires manquants : ${missing.map(d => d.nom).join(', ')}`
      });
    }

    submission.status = 'soumise';
    submission.soumisLe = new Date();
    submission.alerteFormateur = true;
    await submission.save();

    const instructor = await User.findOne({ role: 'instructor' });
    if (instructor) {
      await notifyInstructor(instructor._id, 'submission:received', {
        studentName: `${req.user.prenom} ${req.user.name}`,
        missionTitle: submission.missionId.titre,
        deliverableName: submission.fichiers.map(f => f.nomFichier).join(', '),
        submissionId: submission._id,
        timestamp: new Date()
      });
    }

    res.json({ success: true, data: submission, message: 'Livrable soumis ! Le formateur a été alerté.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
