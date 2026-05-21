const mongoose = require('mongoose');

const absenceSchema = new mongoose.Schema({
  date: Date,
  dureeJours: Number,
  motif: { type: String, enum: ['maladie', 'AT', 'CP', 'RTT', 'sans_motif', 'maternite', 'paternite'] },
  justifie: Boolean
});

const formationSchema = new mongoose.Schema({
  titre: String,
  date: Date,
  dureeHeures: Number,
  cout: Number,
  organisme: String,
  objectif: String
});

const evaluationAnnuelleSchema = new mongoose.Schema({
  annee: Number,
  score: { type: Number, min: 1, max: 5 },
  commentaires: String,
  objectifsAtteints: { type: Number, min: 0, max: 100 }
});

const employeeSchema = new mongoose.Schema({
  matricule: { type: String, unique: true },
  nom: String,
  prenom: String,
  email: String,
  departement: {
    type: String,
    enum: ['RH', 'Production', 'Commercial', 'Marketing', 'R&D', 'Finance', 'Direction', 'Logistique', 'Qualité']
  },
  poste: String,
  niveau: { type: String, enum: ['Employé', 'Technicien', 'Agent de maîtrise', 'Cadre', 'Cadre dirigeant'] },
  contrat: { type: String, enum: ['CDI', 'CDD', 'Stage', 'Alternance', 'Prestataire'] },
  dateEmbauche: Date,
  dateFinContrat: Date,
  anciennete: Number,
  salaireBase: Number,
  salaireCharge: Number,
  categorieSociopro: { type: String, enum: ['Ouvrier', 'ETAM', 'Cadre'] },
  heuresContrat: { type: Number, default: 35 },
  tempsPartiel: { type: Boolean, default: false },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  actif: { type: Boolean, default: true },
  dateSortie: Date,
  motifSortie: { type: String, enum: ['démission', 'licenciement', 'rupture_conventionnelle', 'fin_cdd', 'retraite', null] },

  absences: [absenceSchema],
  formations: [formationSchema],
  evaluationsAnnuelles: [evaluationAnnuelleSchema],

  turnoverRisk: { type: String, enum: ['faible', 'moyen', 'élevé'], default: 'faible' },
  engagement: { type: Number, min: 0, max: 100 },
  satisfaction: { type: Number, min: 0, max: 100 },

  biographie: String,
  pointsForts: [String],
  pointsVigilance: [String],

  anecdoteRH: String
}, { timestamps: true });

employeeSchema.virtual('tauxAbsenteisme').get(function () {
  if (!this.absences || this.absences.length === 0) return 0;
  const totalJours = this.absences.reduce((acc, a) => acc + (a.dureeJours || 0), 0);
  return ((totalJours / 228) * 100).toFixed(2);
});

module.exports = mongoose.model('Employee', employeeSchema);
