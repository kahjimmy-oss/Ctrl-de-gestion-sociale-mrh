const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Non authentifié. Token manquant.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'Utilisateur non trouvé ou désactivé.' });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Session expirée. Veuillez vous reconnecter.' });
    }
    return res.status(401).json({ success: false, message: 'Token invalide.' });
  }
};

const instructorOnly = (req, res, next) => {
  if (req.user.role !== 'instructor') {
    return res.status(403).json({ success: false, message: 'Accès réservé au formateur.' });
  }
  next();
};

const studentOnly = (req, res, next) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ success: false, message: 'Accès réservé aux étudiantes.' });
  }
  next();
};

module.exports = { protect, instructorOnly, studentOnly };
