const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const { protect } = require('../middleware/auth');

router.get('/me', protect, async (req, res) => {
  try {
    const progress = await Progress.findOne({ etudiantId: req.user._id })
      .populate('missions.missionId', 'titre seance ordre type pointsRecompense badge');

    if (!progress) {
      return res.status(404).json({ success: false, message: 'Progression introuvable.' });
    }

    const missionsDone = progress.missions.filter(m => m.status === 'completee').length;
    const totalMissions = progress.missions.length;
    progress.progressionGlobale = totalMissions > 0 ? Math.round((missionsDone / totalMissions) * 100) : 0;
    await progress.save();

    res.json({ success: true, data: progress });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
