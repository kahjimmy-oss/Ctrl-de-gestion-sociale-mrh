const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const { departement, actif, risque } = req.query;
    const filter = {};
    if (departement) filter.departement = departement;
    if (actif !== undefined) filter.actif = actif === 'true';
    if (risque) filter.turnoverRisk = risque;

    const employees = await Employee.find(filter).sort({ departement: 1, nom: 1 });
    res.json({ success: true, data: employees });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ success: false, message: 'Salarié introuvable.' });
    res.json({ success: true, data: employee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
