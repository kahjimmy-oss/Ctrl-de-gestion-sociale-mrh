const nodemailer = require('nodemailer');

let io;
const connectedUsers = new Map();

function initSocketNotifications(socketIo) {
  io = socketIo;

  io.on('connection', (socket) => {
    socket.on('authenticate', (userId) => {
      connectedUsers.set(userId, socket.id);
      socket.join(`user_${userId}`);
      console.log(`🔌 User ${userId} connecté (socket: ${socket.id})`);
    });

    socket.on('disconnect', () => {
      for (const [userId, socketId] of connectedUsers.entries()) {
        if (socketId === socket.id) {
          connectedUsers.delete(userId);
          break;
        }
      }
    });
  });
}

function emitToUser(userId, event, data) {
  if (io) {
    io.to(`user_${userId}`).emit(event, data);
  }
}

function emitToAll(event, data) {
  if (io) {
    io.emit(event, data);
  }
}

async function notifyInstructor(instructorId, event, data) {
  emitToUser(instructorId.toString(), event, data);
  if (process.env.NODE_ENV !== 'test') {
    await sendEmailAlert(event, data);
  }
}

async function sendEmailAlert(event, data) {
  if (!process.env.SMTP_HOST || !process.env.INSTRUCTOR_EMAIL) return;

  const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const subjects = {
    'submission:received': `🎯 Nouveau livrable déposé — ${data.studentName}`,
    'evaluation:submitted': `📝 Évaluation soumise — ${data.studentName} (Séance ${data.seance})`,
    'mission:completed': `✅ Mission complétée — ${data.studentName}`
  };

  const bodies = {
    'submission:received': `
      <h2>Nouveau document déposé sur COSMETICA™ RH Game</h2>
      <p><strong>Étudiante :</strong> ${data.studentName}</p>
      <p><strong>Mission :</strong> ${data.missionTitle}</p>
      <p><strong>Document :</strong> ${data.deliverableName}</p>
      <p><strong>Déposé le :</strong> ${new Date(data.timestamp).toLocaleString('fr-FR')}</p>
      <p><a href="${process.env.FRONTEND_URL}/instructor/submissions/${data.submissionId}">
        → Accéder au tableau de bord formateur pour valider
      </a></p>
    `,
    'evaluation:submitted': `
      <h2>Évaluation individuelle soumise</h2>
      <p><strong>Étudiante :</strong> ${data.studentName}</p>
      <p><strong>Séance :</strong> ${data.seance}</p>
      <p><strong>Soumise le :</strong> ${new Date(data.timestamp).toLocaleString('fr-FR')}</p>
      <p><a href="${process.env.FRONTEND_URL}/instructor/evaluations/${data.evaluationId}">
        → Corriger l'évaluation
      </a></p>
    `
  };

  try {
    await transporter.sendMail({
      from: `"COSMETICA™ RH Game" <${process.env.SMTP_USER}>`,
      to: process.env.INSTRUCTOR_EMAIL,
      subject: subjects[event] || 'Notification COSMETICA™ RH',
      html: bodies[event] || `<p>Événement : ${event}</p><pre>${JSON.stringify(data, null, 2)}</pre>`
    });
  } catch (err) {
    console.error('⚠️ Erreur envoi email :', err.message);
  }
}

module.exports = {
  initSocketNotifications,
  emitToUser,
  emitToAll,
  notifyInstructor,
  sendEmailAlert,
  connectedUsers
};
