const mongoose = require('mongoose');

const variationSchema = new mongoose.Schema({
  texte: String,
  options: [{
    id: String,
    texte: String,
    correct: Boolean,
    feedback: String,
    pointsPartiel: { type: Number, default: 0 }
  }],
  reponseAttendue: String,
  explicationComplete: String,
  ressourcesLiees: [String]
});

const questionSchema = new mongoose.Schema({
  seance: { type: Number, min: 1, max: 4 },
  type: {
    type: String,
    enum: ['qcm', 'qcm_multiple', 'vrai_faux', 'ouverte', 'calcul', 'analyse_cas'],
    required: true
  },
  categorie: {
    type: String,
    enum: ['prerequis', 'cours', 'evaluation', 'bonus'],
    default: 'cours'
  },
  difficulte: { type: String, enum: ['decouverte', 'maitrise', 'expert'], default: 'maitrise' },
  thematiquesCertificateur: [String],
  sujet: String,
  enonce: String,
  contexte: String,
  donneesNumeriques: mongoose.Schema.Types.Mixed,

  variations: [variationSchema],

  variationActive: { type: Number, default: 0 },

  pointsMax: { type: Number, default: 5 },
  tempsLimiteSecondes: Number,

  debloqueMissionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mission' },
  debloqueContenu: [String],

  objectifPedagogique: String,
  notePedagogique: String,

  statistiques: {
    nbReponses: { type: Number, default: 0 },
    nbCorrectes: { type: Number, default: 0 },
    tauxReussite: { type: Number, default: 0 }
  }
}, { timestamps: true });

questionSchema.methods.getRandomVariation = function () {
  if (!this.variations || this.variations.length === 0) return null;
  const idx = Math.floor(Math.random() * this.variations.length);
  return { ...this.variations[idx].toObject(), variationIndex: idx };
};

module.exports = mongoose.model('Question', questionSchema);
