const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  deliverableId: String,
  nomFichier: String,
  urlFichier: String,
  taille: Number,
  type: String,
  deposeLe: { type: Date, default: Date.now },
  commentaireEtudiant: String
});

const annotationSchema = new mongoose.Schema({
  deliverableId: String,
  commentaire: String,
  score: Number,
  maxScore: Number,
  validePar: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  valideLeDate: Date
});

const submissionSchema = new mongoose.Schema({
  etudiantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  missionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mission', required: true },
  seance: { type: Number, min: 1, max: 4 },
  groupe: String,

  fichiers: [fileSchema],
  annotations: [annotationSchema],

  status: {
    type: String,
    enum: ['brouillon', 'soumise', 'en_revision', 'approuvee', 'approuvee_partielle', 'a_retravailler'],
    default: 'brouillon'
  },

  feedbackFormateur: String,
  scoreQualite: { type: Number, min: 0, max: 100 },

  soumisLe: Date,
  valideLe: Date,
  valideParId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  tentative: { type: Number, default: 1 },
  historiqueVersions: [{
    version: Number,
    soumisLe: Date,
    status: String,
    feedback: String
  }],

  alerteFormateur: { type: Boolean, default: false },
  alerteFormateurVue: { type: Boolean, default: false }
}, { timestamps: true });

submissionSchema.index({ etudiantId: 1, missionId: 1 });

module.exports = mongoose.model('Submission', submissionSchema);
