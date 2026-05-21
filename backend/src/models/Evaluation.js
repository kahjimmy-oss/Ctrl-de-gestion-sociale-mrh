const mongoose = require('mongoose');

const reponseEvalSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  enonce: String,
  type: String,
  reponseEtudiante: mongoose.Schema.Types.Mixed,
  reponseCorrecte: mongoose.Schema.Types.Mixed,
  pointsObtenus: { type: Number, default: 0 },
  pointsMax: Number,
  feedback: String,
  corrigePar: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const evaluationSchema = new mongoose.Schema({
  etudiantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seance: { type: Number, min: 1, max: 4, required: true },

  questions: [reponseEvalSchema],

  noteFinale: { type: Number, min: 0, max: 20 },
  noteCalculee: { type: Number, min: 0, max: 20 },

  status: {
    type: String,
    enum: ['non_commence', 'en_cours', 'soumise', 'en_correction', 'corrigee'],
    default: 'non_commence'
  },

  debuteLe: Date,
  soumisLe: Date,
  corrigeLe: Date,
  corrigeParId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dureeSecondes: Number,

  commentaireGlobal: String,

  criteres: {
    comprehensionTheorique: { note: { type: Number }, pointsMax: { type: Number, default: 8 }, commentaire: String },
    analyseCritique: { note: { type: Number }, pointsMax: { type: Number, default: 8 }, commentaire: String },
    clartéExposition: { note: { type: Number }, pointsMax: { type: Number, default: 4 }, commentaire: String }
  },

  accessible: { type: Boolean, default: false }
}, { timestamps: true });

evaluationSchema.index({ etudiantId: 1, seance: 1 }, { unique: true });

module.exports = mongoose.model('Evaluation', evaluationSchema);
