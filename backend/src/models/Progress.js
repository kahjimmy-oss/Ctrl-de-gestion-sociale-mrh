const mongoose = require('mongoose');

const missionProgressSchema = new mongoose.Schema({
  missionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mission' },
  status: { type: String, enum: ['verrouillee', 'active', 'soumise', 'completee'], default: 'verrouillee' },
  debloqueLe: Date,
  commenceLe: Date,
  completeLe: Date,
  tentatives: { type: Number, default: 0 }
});

const questionProgressSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  repondue: { type: Boolean, default: false },
  correcte: { type: Boolean, default: false },
  nbTentatives: { type: Number, default: 0 },
  variationUtilisee: Number,
  repondueLeDate: Date,
  pointsGagnes: { type: Number, default: 0 }
});

const progressSchema = new mongoose.Schema({
  etudiantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

  seanceActive: { type: Number, default: 1, min: 1, max: 4 },

  progressionGlobale: { type: Number, default: 0, min: 0, max: 100 },

  seances: [{
    numero: { type: Number, min: 1, max: 4 },
    debloquee: { type: Boolean, default: false },
    commencee: { type: Boolean, default: false },
    completee: { type: Boolean, default: false },
    progressionPct: { type: Number, default: 0 },
    evaluationPassee: { type: Boolean, default: false },
    noteEvaluation: Number
  }],

  missions: [missionProgressSchema],
  questions: [questionProgressSchema],

  scoreTotal: { type: Number, default: 0 },
  badges: [String],

  derniereActivite: { type: Date, default: Date.now }
}, { timestamps: true });

progressSchema.methods.getSeanceProgress = function (numSeance) {
  return this.seances.find(s => s.numero === numSeance);
};

progressSchema.methods.isMissionUnlocked = function (missionId) {
  const mp = this.missions.find(m => m.missionId.toString() === missionId.toString());
  return mp && (mp.status === 'active' || mp.status === 'soumise' || mp.status === 'completee');
};

module.exports = mongoose.model('Progress', progressSchema);
