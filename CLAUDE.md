# COSMETICA™ — Jeu pédagogique RH pour Master RH 1ère année

## Contexte du projet

Application web full-stack de jeu pédagogique interactif sur le **contrôle de gestion sociale appliquée aux RH**, destinée à une promotion de Master RH 1ère année. L'entreprise fictive est **COSMETICA™**, PME cosmétique de 65 salariés.

### Structure des sessions
- **4 sessions de 3h30** chacune
- Mode collectif ET individuel
- Les étudiants ne peuvent pas avancer sans validation du formateur
- Login personnel pour chaque étudiant
- Alertes temps réel au formateur quand un document est soumis
- Évaluations individuelles notées sur 20

---

## Stack technique

| Couche | Techno |
|--------|--------|
| Backend | Node.js + Express + MongoDB (Mongoose) + Socket.io + Multer + Nodemailer |
| Frontend | React 18 + Vite + TailwindCSS + React Router v6 + Socket.io-client |
| Auth | JWT (roles : student / instructor) |
| Infra | Docker Compose (MongoDB + backend + frontend nginx) |

---

## Dépôt GitHub

- **Repo** : `kahjimmy-oss/Ctrl-de-gestion-sociale-mrh`
- **Branche de développement** : `claude/dazzling-fermat-rxMJA`
- **Ne jamais pusher sur `main` sans accord explicite**

---

## Architecture des fichiers

```
Ctrl-de-gestion-sociale-mrh/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── server.js              # Express + Socket.io + routes
│       ├── data/
│       │   ├── employees.js       # 20 salariés fictifs COSMETICA
│       │   ├── missions.js        # 10 missions sur 4 séances
│       │   ├── questions.js       # Banque de questions avec variations
│       │   └── seed.js            # Peuplement base de données
│       ├── middleware/
│       │   ├── auth.js            # JWT protect, instructorOnly, studentOnly
│       │   └── upload.js          # Multer (PDF/DOCX/XLSX/PPTX, 10MB)
│       ├── models/
│       │   ├── User.js            # bcrypt, comparePassword(), toSafeObject()
│       │   ├── Employee.js        # Schéma complet avec absences, formations, évals
│       │   ├── Mission.js         # seance, type, deliverables, critereDeblocage
│       │   ├── Question.js        # variations[], getRandomVariation()
│       │   ├── Submission.js      # fichiers[], status, annotations, historique
│       │   ├── Evaluation.js      # questions[], noteFinale/20, criteres
│       │   └── Progress.js        # missions[], seances[], badges[], score
│       ├── routes/
│       │   ├── auth.js            # POST /login, POST /register, GET /me
│       │   ├── missions.js        # GET /, GET /:id, GET /:id/employees
│       │   ├── questions.js       # GET /seance/:n, POST /:id/answer
│       │   ├── submissions.js     # GET, POST, upload, submit
│       │   ├── evaluations.js     # GET, start, submit par séance
│       │   ├── instructor.js      # dashboard, validate, grade, unlock
│       │   ├── progress.js        # GET /me
│       │   └── employees.js       # GET /, GET /:id
│       └── services/
│           └── notificationService.js  # Socket.io rooms + email Nodemailer
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    ├── vite.config.js
    └── src/
        ├── App.jsx                # Router + ProtectedRoute + rôles
        ├── main.jsx
        ├── index.css
        ├── context/
        │   └── AuthContext.jsx    # JWT + localStorage
        ├── hooks/
        │   └── useSocket.js       # Socket.io client, events temps réel
        ├── services/
        │   └── api.js             # Axios + intercepteur JWT + 401 redirect
        ├── components/common/
        │   └── Navbar.jsx         # Navigation role-based + badge notifications
        └── pages/
            ├── LoginPage.jsx
            ├── StudentDashboard.jsx     # 4 onglets séances, missions, évals, badges
            ├── MissionPage.jsx          # Quiz → Mission → Soumis
            ├── EvaluationPage.jsx       # Timer, Q par Q, résultats
            ├── EmployeesPage.jsx        # Annuaire + fiche détaillée
            ├── InstructorDashboard.jsx  # Alertes RT, progression étudiants, analytics
            ├── InstructorSubmissionsPage.jsx  # Validation split-view
            └── InstructorEvaluationsPage.jsx  # Notation /20 par question
```

---

## Mécanique du jeu

```
Question prérequis → réponse correcte
         ↓
    Mission débloquée
         ↓
  Dépôt documents (Multer)
         ↓
  Alerte formateur (Socket.io + email)
         ↓
  Validation formateur (approve / à retravailler)
         ↓
  Évaluation individuelle débloquée
         ↓
  Étudiant répond → formateur note /20
         ↓
  Badge + séance suivante débloquée
```

---

## Données fictives COSMETICA™

### 20 salariés (employees.js)

| Matricule | Nom | Poste | Dept | Actif | Risque |
|-----------|-----|-------|------|-------|--------|
| COS-001 | Isabelle BERNARD | Directrice Générale | Direction | Oui | faible |
| COS-002 | Sophie MARTIN | Responsable RH | RH | Oui | faible |
| COS-003 | Marc DURAND | Directeur Commercial | Commercial | Oui | **élevé** |
| COS-004 | Julie PETIT | Commerciale Senior | Commercial | Oui | **élevé** |
| COS-005 | Thomas LEROY | Responsable Production | Production | Oui | faible |
| COS-006 | Amandine MOREAU | Opératrice production | Production | Oui | moyen |
| COS-007 | Ricardo GARCIA | Technicien Qualité | Production | Oui | faible |
| COS-008 | Eléonore ROUSSEAU | Resp. Marketing Digital | Marketing | Oui | moyen |
| COS-009 | Nathalie LEBLANC | Contrôleur de Gestion | Finance | Oui | faible |
| COS-010 | Karim FONTAINE | Chef de Projet R&D | R&D | Oui | faible |
| COS-011 | Laura SIMON | Commerciale Junior | Commercial | Oui | moyen |
| COS-012 | Patrick CHEVALIER | Responsable Logistique | Logistique | Oui | moyen |
| COS-013 | Anaïs MEUNIER | Opératrice Ligne B (CDD) | Production | Oui | moyen |
| COS-014 | David PERRIN | Graphiste | Marketing | **Non** | élevé |
| COS-015 | Chloé LAMBERT | Assistante RH (Alternance) | RH | Oui | faible |
| COS-016 | Sylvie RENARD | Responsable Qualité | Qualité | Oui | faible |
| COS-017 | Mohamed GIRARD | Opérateur Production Senior | Production | Oui | faible |
| COS-018 | Alice BENOIT | Chargée Grands Comptes | Commercial | **Non** | élevé |
| COS-019 | Henri DUPONT | Responsable Paie | Finance | Oui | faible |
| COS-020 | Corinne VIDAL | Opératrice Production | Production | Oui | moyen |

**Cas RH clés pour les missions :**
- **Marc Durand** : management toxique → 4 démissions dans son équipe
- **Julie Petit** : talent critique en risque de départ (2 offres reçues, refus augmentation)
- **Patrick Chevalier** : 42 jours d'absence 2023 (TMS chronique)
- **Corinne Vidal** : maladie professionnelle reconnue (TMS tendinite)
- **Sophie Martin** : burn-out RH latent, surcharge chronique
- **David Perrin** : démissionné jan. 2024, coût ~17k€
- **Alice Benoît** : rupture conventionnelle mars 2024, coût ~53k€ total

### 10 missions (missions.js)

| ID | Séance | Type | Titre |
|----|--------|------|-------|
| M1 | 1 | collectif | Audit Recrutement COSMETICA |
| M2 | 1 | individuel | Évaluation individuelle S1 |
| M3 | 2 | collectif | Crise budgétaire : analyse masse salariale |
| M4 | 2 | individuel | Évaluation individuelle S2 |
| M5 | 3 | collectif | Opération Thermomètre Social |
| M6 | 3 | individuel | Évaluation individuelle S3 |
| M7 | 4 | collectif | Présentation CODIR finale |
| M8 | 4 | individuel | Évaluation individuelle S4 |

### Banque de questions (questions.js)

| Séance | Catégorie | Type | Sujet |
|--------|-----------|------|-------|
| 1 | prérequis | vrai_faux | Nature du recrutement (3 variations) |
| 1 | cours | qcm_multiple | Indicateurs KPI recrutement |
| 1 | évaluation | analyse_cas | Turnover 40% commercial (2 variations) |
| 2 | prérequis | vrai_faux | Masse salariale et adaptation (2 variations) |
| 2 | cours | calcul | Calcul masse salariale + écarts (2 variations) |
| 2 | évaluation | analyse_cas | PSE vs alternatives APLD |
| 3 | prérequis | vrai_faux | Baromètre social et performance (2 variations) |
| 3 | cours | analyse_cas | Construction baromètre social |
| 4 | prérequis | vrai_faux | Capital humain et baromètre |
| 4 | évaluation | analyse_cas | Analyse écarts budgétaires |
| 4 | évaluation | analyse_cas | TOP 3 risques sociaux (2 variations) |

---

## Utilisateurs de test (après seed.js)

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Formateur | formateur@cosmetica.fr | Formateur2024! |
| Étudiant 1 | etudiant1@cosmetica.fr | Etudiant2024! |
| Étudiant 2 | etudiant2@cosmetica.fr | Etudiant2024! |
| Étudiant 3 | etudiant3@cosmetica.fr | Etudiant2024! |
| Étudiant 4 | etudiant4@cosmetica.fr | Etudiant2024! |

Code d'inscription pour nouveaux étudiants : `COSMETICA2024`

---

## Lancement

```bash
# 1. Cloner et basculer sur la branche
git clone https://github.com/kahjimmy-oss/Ctrl-de-gestion-sociale-mrh.git
cd Ctrl-de-gestion-sociale-mrh
git checkout claude/dazzling-fermat-rxMJA

# 2. Configurer l'env
cp backend/.env.example backend/.env
# Éditer backend/.env (INSTRUCTOR_EMAIL, SMTP si besoin)

# 3. Démarrer
docker-compose up --build

# 4. Peupler la base (dans un autre terminal)
docker-compose exec backend node src/data/seed.js

# 5. Accéder
# → http://localhost
```

---

## Variables d'environnement (backend/.env)

```env
PORT=5000
MONGODB_URI=mongodb://mongo:27017/cosmetica_rh
JWT_SECRET=<chaine_aleatoire_32_chars>
JWT_EXPIRES_IN=24h
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre_email@gmail.com
SMTP_PASS=votre_mot_de_passe_app
INSTRUCTOR_EMAIL=votre_email@email.com
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
REGISTRATION_CODE=COSMETICA2024
```

---

## Thématiques certifiantes couvertes

- Procédures de contrôle de gestion RH
- Indicateurs RH (recrutement, formation, budget)
- Budget RH dans le compte de résultat
- Indicateurs individuels et collectifs : turnover, absentéisme, CP, AT, PSE, adaptation masse salariale + actions correctives
- Tableau de bord + reporting
- Gestion des risques sociaux
- Rapports de contrôles
- Analyse des écarts

---

## État actuel du projet

**Tout est implémenté et pushé** sur `claude/dazzling-fermat-rxMJA`. Le code est syntaxiquement valide (tous les modèles et routes chargent sans erreur Node.js).

**Ce qui reste à faire / améliorer selon vos besoins :**
- Personnaliser les emails SMTP
- Ajouter des étudiants supplémentaires dans seed.js
- Ajuster les critères de notation dans EvaluationPage.jsx
- Ajouter des questions ou missions supplémentaires dans les fichiers data/
- Tests end-to-end
- Déploiement production (VPS, Railway, Render...)
