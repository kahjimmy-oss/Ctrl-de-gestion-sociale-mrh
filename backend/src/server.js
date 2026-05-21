require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const missionRoutes = require('./routes/missions');
const questionRoutes = require('./routes/questions');
const submissionRoutes = require('./routes/submissions');
const evaluationRoutes = require('./routes/evaluations');
const instructorRoutes = require('./routes/instructor');
const progressRoutes = require('./routes/progress');
const employeeRoutes = require('./routes/employees');

const { initSocketNotifications } = require('./services/notificationService');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: 'Trop de requêtes, veuillez réessayer.'
});
app.use('/api/', limiter);

app.use('/api/auth', authRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/instructor', instructorRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/employees', employeeRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date(), app: 'COSMETICA™ RH Game' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur serveur interne'
  });
});

initSocketNotifications(io);

app.set('io', io);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cosmetica_rh')
  .then(() => {
    console.log('✅ MongoDB connecté');
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 Serveur COSMETICA™ RH actif sur port ${PORT}`);
      console.log(`🎮 Jeu interactif Master RH - Contrôle de Gestion Sociale`);
    });
  })
  .catch(err => {
    console.error('❌ Erreur MongoDB:', err);
    process.exit(1);
  });

module.exports = { app, io };
