# Architecture Technique - Jeu RH Master

## 🏗️ Vue d'Ensemble

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React 18)                  │
│  ┌─────────────────┐           ┌──────────────────┐    │
│  │ Interface       │           │ Interface        │    │
│  │ Étudiante       │           │ Formateur        │    │
│  │ - Missions      │           │ - Dashboard      │    │
│  │ - Quizz         │           │ - Validations    │    │
│  │ - Évaluation    │           │ - Alertes        │    │
│  └────────┬────────┘           └────────┬─────────┘    │
│           └─────────────────┬───────────┘               │
└─────────────────────────────┼────────────────────────────┘
                              │ HTTP/WebSocket
┌─────────────────────────────┴────────────────────────────┐
│              BACKEND (Node.js + Express)                │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ API Routes   │  │ Controllers  │  │ Middleware   │   │
│  │ - Auth       │  │ - Missions   │  │ - JWT Auth   │   │
│  │ - Missions   │  │ - Questions  │  │ - Validation │   │
│  │ - Éval       │  │ - Upload     │  │ - CORS       │   │
│  │ - Upload     │  │ - Scoring    │  └──────────────┘   │
│  └──────────────┘  └──────────────┘                     │
│         │                 │                              │
│         └─────────┬───────┘                              │
│                   │                                      │
│         ┌─────────┴─────────┐                           │
│         │ Services Métier   │                           │
│         ├─ Game Engine      │                           │
│         ├─ Notification Sys │                           │
│         ├─ Scoring Engine   │                           │
│         └─ Analytics        │                           │
└─────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────┴──────────────────────────────┐
│              DATA LAYER (MongoDB)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Collections:                                         │  │
│  │ - users (students + instructor)                     │  │
│  │ - missions (scenarios, 4 séances)                   │  │
│  │ - questions (théoriques avec variations)            │  │
│  │ - submissions (documents déposés)                   │  │
│  │ - evaluations (scores 0-20 par séance)              │  │
│  │ - progress (tracking mission/question)              │  │
│  │ - cosmetica_employees (base salariés fictifs)       │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

## 🗄️ Schémas MongoDB

### 1. **Users Collection**
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  role: Enum["student", "instructor"],
  
  // Infos étudiante
  name: String,
  prenom: String,
  groupe: String, // Groupe de TP
  
  // Tracking
  createdAt: Date,
  lastLogin: Date,
  
  // Notifications
  notificationPreferences: {
    email: Boolean,
    dashboard: Boolean
  }
}
```

### 2. **Missions Collection**
```javascript
{
  _id: ObjectId,
  seance: Number, // 1-4
  titre: String,
  description: String,
  objectifs: [String], // Liens avec certificateur
  duree: Number, // en minutes
  
  // Flux jeu
  questionPrealable: ObjectId, // Ref Questions
  missionDescription: String,
  deliverables: [
    {
      name: String,
      template: String (URL),
      instructions: String,
      mandatory: Boolean
    }
  ],
  
  // Contexte COSMETICA
  scenarioContext: String,
  affectedEmployees: [ObjectId], // Ref CosmeticaEmployees
  
  // Timing
  sequence: Number, // Ordre dans séance
  publicAt: Date,
  status: Enum["draft", "published", "archived"]
}
```

### 3. **Questions Collection**
```javascript
{
  _id: ObjectId,
  seance: Number,
  topic: String, // Ex: "indicateurs RH"
  
  // Variations pour progression
  difficulty: Enum["basic", "intermediate", "expert"],
  variations: [
    {
      question: String,
      correctAnswer: String,
      explanations: [
        { answer: String, feedback: String }
      ],
      unlocksContent: [ObjectId] // Ref missions/resources
    }
  ],
  
  // Pédagogie
  pedagogicalGoal: String,
  certificateurTheme: String, // Lien avec objectifs
  
  // Tracking
  createdAt: Date,
  difficulty: String
}
```

### 4. **Submissions Collection**
```javascript
{
  _id: ObjectId,
  studentId: ObjectId, // Ref Users
  missionId: ObjectId, // Ref Missions
  
  // Fichiers
  deliverables: [
    {
      name: String,
      fileUrl: String (S3/MinIO),
      uploadedAt: Date,
      validated: Boolean,
      feedback: String
    }
  ],
  
  // Validation Formateur
  status: Enum["draft", "submitted", "reviewing", "approved", "rejected"],
  instructorFeedback: String,
  validatedAt: Date,
  validatedBy: ObjectId,
  
  // Qualité contenus
  qualityScore: Number, // 0-100
  notes: String,
  
  createdAt: Date,
  updatedAt: Date
}
```

### 5. **Evaluations Collection**
```javascript
{
  _id: ObjectId,
  studentId: ObjectId,
  seance: Number,
  
  // Questions éval (20/20)
  questions: [
    {
      question: String,
      studentAnswer: String,
      points: Number,
      maxPoints: Number,
      feedback: String
    }
  ],
  
  // Synthèse
  totalScore: Number, // /20
  status: Enum["draft", "submitted", "graded"],
  gradedAt: Date,
  
  // Contexte
  completedAt: Date,
  duration: Number // secondes
}
```

### 6. **Progress Collection**
```javascript
{
  _id: ObjectId,
  studentId: ObjectId,
  seance: Number,
  
  // Missions
  missionProgress: [
    {
      missionId: ObjectId,
      status: Enum["locked", "active", "completed"],
      startedAt: Date,
      completedAt: Date,
      attemptCount: Number
    }
  ],
  
  // Questions
  questionProgress: [
    {
      questionId: ObjectId,
      answered: Boolean,
      correct: Boolean,
      attemptCount: Number,
      unlockedContent: [ObjectId]
    }
  ],
  
  // Globale
  seanceProgress: Number, // 0-100 %
  lastActivityAt: Date
}
```

### 7. **CosmeticaEmployees Collection**
```javascript
{
  _id: ObjectId,
  name: String,
  prenom: String,
  email: String,
  departement: String, // RH, Production, Commercial, etc.
  poste: String,
  
  // Données RH réalistes
  dateEmbauche: Date,
  salaire: Number,
  contrat: Enum["CDI", "CDD", "Stage"],
  anciennete: Number, // années
  
  // Historique pour scénarios
  absencesHistory: [
    { date: Date, duree: Number, motif: String }
  ],
  formationHistory: [
    { titre: String, date: Date, cout: Number }
  ],
  evaluations: [
    { date: Date, score: Number, commentaires: String }
  ],
  turnoverRisk: Enum["low", "medium", "high"],
  
  // Créé pour mission
  createdAt: Date,
  actif: Boolean
}
```

## 🔐 Authentification & Autorisation

```javascript
// JWT Payload
{
  userId: ObjectId,
  email: String,
  role: "student" | "instructor",
  iat: Timestamp,
  exp: Timestamp
}

// Middleware de protection
- PublicRoutes: /auth/login, /auth/register
- StudentRoutes: /missions, /questions, /submissions, /progress
- InstructorRoutes: /dashboard, /validations, /submissions/:id/approve
```

## 📡 Endpoints API (Structure)

### Auth
- `POST /api/auth/register` - Créer compte
- `POST /api/auth/login` - Se connecter
- `POST /api/auth/refresh` - Renouveler token

### Missions
- `GET /api/missions` - Liste missions (accessible)
- `GET /api/missions/:id` - Détail mission
- `GET /api/missions/:id/context` - Contexte + données COSMETICA

### Questions
- `GET /api/questions/:id` - Question avec variations
- `POST /api/questions/:id/answer` - Répondre + débloquer contenu

### Submissions
- `POST /api/submissions` - Créer soumission
- `POST /api/submissions/:id/upload` - Upload fichier
- `PUT /api/submissions/:id` - Mettre à jour
- `GET /api/submissions/:id` - Voir soumission

### Instructor Dashboard
- `GET /api/instructor/dashboard` - Vue cohorte
- `GET /api/instructor/submissions` - Toutes soumissions
- `PUT /api/instructor/submissions/:id/approve` - Valider
- `GET /api/instructor/analytics` - Métriques

### Notifications (WebSocket)
- `submission:received` - Alerte doc déposé
- `submission:approved` - Validation reçue
- `question:unlocked` - Contenu débloqué

## 🔔 Système de Notifications

**WebSocket + Email**

```javascript
// Événements
1. Student uploads deliverable
   → Emit: "submission:received" to instructor
   → Email: formateur@email.com

2. Instructor approves submission
   → Emit: "submission:approved" to student
   → Email: etudiant@email.com + Dashboard notif

3. Student answers question correctly
   → Emit: "content:unlocked" to student
   → Update progress in real-time
```

## 🚀 Déploiement

```yaml
# docker-compose.yml
services:
  mongodb:
    image: mongo:latest
    ports: ["27017:27017"]
  
  backend:
    build: ./backend
    ports: ["5000:5000"]
    env: .env
    depends_on: [mongodb]
  
  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    depends_on: [backend]
```

## 📦 Dépendances Clés

**Backend**
- express, cors, helmet
- jsonwebtoken, bcrypt
- mongoose
- multer (uploads)
- socket.io (WebSocket)
- dotenv

**Frontend**
- react, react-router-dom
- axios
- tailwindcss
- zustand (state management)
- react-hook-form
- recharts (graphiques)

---

Prêt à développer les détails de chaque partie ! 🎯
