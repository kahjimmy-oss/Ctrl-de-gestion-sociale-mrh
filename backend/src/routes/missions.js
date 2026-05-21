const express = require('express');
const router = express.Router();
const Mission = require('../models/Mission');
const Progress = require('../models/Progress');
const Employee = require('../models/Employee');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const missions = await Mission.find({ status: 'publiee' }).sort({ seance: 1, ordre: 1 });

    if (req.user.role === 'student') {
      const progress = await Progress.findOne({ etudiantId: req.user._id });
      const missionsWithStatus = missions.map(m => {
        const mp = progress?.missions?.find(p => p.missionId.toString() === m._id.toString());
        return {
          ...m.toObject(),
          progressStatus: mp?.status || 'verrouillee',
          debloqueLe: mp?.debloqueLe,
          completeLe: mp?.completeLe
        };
      });
      return res.json({ success: true, data: missionsWithStatus });
    }

    res.json({ success: true, data: missions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id).populate('employesConcernes');
    if (!mission) return res.status(404).json({ success: false, message: 'Mission introuvable.' });

    if (req.user.role === 'student') {
      const progress = await Progress.findOne({ etudiantId: req.user._id });
      const mp = progress?.missions?.find(p => p.missionId.toString() === mission._id.toString());
      if (!mp || mp.status === 'verrouillee') {
        return res.status(403).json({ success: false, message: 'Cette mission est verrouillée. Complétez les étapes précédentes.' });
      }
    }

    const employees = await Employee.find({ actif: true }).select('matricule nom prenom departement poste contrat biographie anecdoteRH turnoverRisk engagement satisfaction');

    res.json({ success: true, data: { ...mission.toObject(), employesCosmetica: employees } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id/employees', protect, async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);
    if (!mission) return res.status(404).json({ success: false, message: 'Mission introuvable.' });

    const employees = await Employee.find({}).sort({ departement: 1, nom: 1 });
    res.json({ success: true, data: employees });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
