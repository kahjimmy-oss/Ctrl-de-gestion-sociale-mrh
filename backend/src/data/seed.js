require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Employee = require('../models/Employee');
const Mission = require('../models/Mission');
const Question = require('../models/Question');
const Progress = require('../models/Progress');
const Evaluation = require('../models/Evaluation');

const employeesData = require('./employees');
const missionsData = require('./missions');
const questionsData = require('./questions');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cosmetica_rh';

const seedUsers = [
  {
    email: 'formateur@cosmetica-rh.fr',
    password: 'Formateur2024!',
    role: 'instructor',
    name: 'MARTIN',
    prenom: 'Jean-Pierre',
    groupe: 'Formateur'
  },
  {
    email: 'alice.dupont@etudiant.fr',
    password: 'Etudiant2024!',
    role: 'student',
    name: 'DUPONT',
    prenom: 'Alice',
    groupe: 'Master RH 1'
  },
  {
    email: 'marie.bernard@etudiant.fr',
    password: 'Etudiant2024!',
    role: 'student',
    name: 'BERNARD',
    prenom: 'Marie',
    groupe: 'Master RH 1'
  },
  {
    email: 'sophie.moreau@etudiant.fr',
    password: 'Etudiant2024!',
    role: 'student',
    name: 'MOREAU',
    prenom: 'Sophie',
    groupe: 'Master RH 1'
  },
  {
    email: 'lea.thomas@etudiant.fr',
    password: 'Etudiant2024!',
    role: 'student',
    name: 'THOMAS',
    prenom: 'Léa',
    groupe: 'Master RH 1'
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    await Promise.all([
      User.deleteMany({}),
      Employee.deleteMany({}),
      Mission.deleteMany({}),
      Question.deleteMany({}),
      Progress.deleteMany({}),
      Evaluation.deleteMany({})
    ]);
    console.log('🗑️  Collections vidées');

    const users = await User.insertMany(seedUsers);
    console.log(`✅ ${users.length} utilisateurs créés`);

    const employees = await Employee.insertMany(employeesData);
    console.log(`✅ ${employees.length} salariés COSMETICA™ créés`);

    const questions = await Question.insertMany(questionsData.map(q => ({
      ...q,
      variationActive: 0
    })));
    console.log(`✅ ${questions.length} questions pédagogiques créées`);

    const missionsToInsert = missionsData.map((m, i) => ({
      ...m,
      questionPrealableId: m.critereDeblocage?.type === 'question'
        ? questions.find(q => q.seance === m.seance && q.categorie === 'prerequis')?._id
        : null
    }));

    const missions = await Mission.insertMany(missionsToInsert);
    console.log(`✅ ${missions.length} missions créées (4 séances)`);

    const students = users.filter(u => u.role === 'student');
    const allMissions = missions;

    for (const student of students) {
      const seances = [1, 2, 3, 4].map(n => ({
        numero: n,
        debloquee: n === 1,
        commencee: false,
        completee: false,
        progressionPct: 0,
        evaluationPassee: false
      }));

      const missionProgress = allMissions.map(m => ({
        missionId: m._id,
        status: m.seance === 1 && m.ordre === 1 ? 'active' : 'verrouillee',
        debloqueLe: m.seance === 1 && m.ordre === 1 ? new Date() : null,
        tentatives: 0
      }));

      const evalDocs = [1, 2, 3, 4].map(seance => ({
        etudiantId: student._id,
        seance,
        status: 'non_commence',
        accessible: seance === 1,
        questions: []
      }));

      await Progress.create({
        etudiantId: student._id,
        seanceActive: 1,
        progressionGlobale: 0,
        seances,
        missions: missionProgress,
        questions: [],
        scoreTotal: 0,
        badges: []
      });

      for (const evalDoc of evalDocs) {
        await Evaluation.create(evalDoc);
      }
    }
    console.log(`✅ Progression et évaluations initialisées pour ${students.length} étudiantes`);

    console.log('\n🎮 =======================================');
    console.log('   COSMETICA™ RH GAME — BASE INITIALISÉE');
    console.log('=======================================');
    console.log('\n📧 COMPTES CRÉÉS :');
    console.log('   Formateur : formateur@cosmetica-rh.fr / Formateur2024!');
    console.log('   Étudiante 1 : alice.dupont@etudiant.fr / Etudiant2024!');
    console.log('   Étudiante 2 : marie.bernard@etudiant.fr / Etudiant2024!');
    console.log('   Étudiante 3 : sophie.moreau@etudiant.fr / Etudiant2024!');
    console.log('   Étudiante 4 : lea.thomas@etudiant.fr / Etudiant2024!');
    console.log('\n📊 DONNÉES :');
    console.log(`   - ${employees.length} salariés fictifs COSMETICA™`);
    console.log(`   - ${missions.length} missions (4 séances de 3,5h)`);
    console.log(`   - ${questions.length} questions pédagogiques avec variations`);
    console.log('\n🚀 Prêt à jouer !');

    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur seed :', err);
    process.exit(1);
  }
}

seed();
