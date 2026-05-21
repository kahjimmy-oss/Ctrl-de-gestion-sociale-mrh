const mongoose = require('mongoose');

const deliverableSchema = new mongoose.Schema({
  id: String,
  nom: String,
  description: String,
  instructions: String,
  templateUrl: String,
  obligatoire: { type: Boolean, default: true },
  critereEvaluation: String
});

const missionSchema = new mongoose.Schema({
  seance: { type: Number, required: true, min: 1, max: 4 },
  ordre: { type: Number, required: true },
  titre: String,
  sousTitre: String,
  description: String,
  contexteNarratif: String,
  objectifsPedagogiques: [String],
  thematiquesCertificateur: [String],
  dureeEstimeeMin: Number,
  type: { type: String, enum: ['collectif', 'individuel', 'prerequis'], default: 'collectif' },

  questionPrealableId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },

  deliverables: [deliverableSchema],

  donneesFournies: mongoose.Schema.Types.Mixed,
  employesConcernes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }],

  status: { type: String, enum: ['brouillon', 'publiee', 'archivee'], default: 'publiee' },

  critereDeblocage: {
    type: { type: String, enum: ['question', 'soumission_validee', 'evaluation_passee', 'manuel'] },
    referenceId: mongoose.Schema.Types.ObjectId,
    missionPrecedenteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mission' }
  },

  pointsRecompense: { type: Number, default: 25 },
  badge: String
}, { timestamps: true });

module.exports = mongoose.model('Mission', missionSchema);
