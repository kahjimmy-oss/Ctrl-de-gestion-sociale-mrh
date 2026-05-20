# Jeu Interactif : Contrôle de Gestion Sociale RH

**Plateforme pédagogique gamifiée** pour Master RH 1ère année | 4 séances de 3,5h

## 🎯 Objectifs Pédagogiques

### Thèmes Certificateur (Obligatoires)
- ✅ Procédure du contrôle de gestion appliqué aux RH
- ✅ Indicateurs du service RH (recrutement, formation, budget, délais, dysfonctionnements)
- ✅ Budget RH dans le compte de résultat
- ✅ Indicateurs de performances individuelles et collectives (heures, productivité, mobilité, turnover, absentéisme, CP, AT, masse salariale, PSE)
- ✅ Actions correctives générées par contrôle de gestion RH
- ✅ Tableau de bord et reporting
- ✅ Gestion des risques et aléas sociaux
- ✅ Rapports de contrôles
- ✅ Analyse des écarts
- ✅ Baromètre social - mesure du capital humain

## 🎮 Mécanique du Jeu

### Contexte Narratif
**Entreprise fictive** : COSMETICA™ - PME cosmétique (50-80 salariés)
- Vrais faux salariés avec profils, historiques
- Situations RH réalistes et complexes
- Thématiques alignées avec modules Master

### Modalités
| Aspect | Détails |
|--------|---------|
| **Collectif** | Missions équipe avec validation prof intermédiaire |
| **Individuel** | Entraînement + Évaluation (20/20 par séance) |
| **Progression** | Déblocage via réponses à questions théoriques |
| **Accès** | Personnel par étudiante (authentification) |
| **Formateur** | Tableau de bord + alertes instantanées dépôts docs |

## 📊 Structure du Projet

```
├── backend/
│   ├── src/
│   │   ├── routes/          # API endpoints
│   │   ├── models/          # Data schemas
│   │   ├── controllers/     # Business logic
│   │   ├── middleware/      # Auth, validation
│   │   ├── notifications/   # Alertes formateur
│   │   └── server.js        # Entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # UI components (Student, Instructor)
│   │   ├── pages/          # Page views
│   │   ├── services/       # API client
│   │   ├── hooks/          # Custom hooks
│   │   ├── context/        # Auth context
│   │   └── App.jsx
│   └── package.json
├── data/
│   ├── scenarios/          # Missions par séance
│   ├── questions/          # Questions théoriques
│   ├── evaluation/         # Grilles éval 20/20
│   └── employees.json      # Profils salariés COSMETICA
├── docs/
│   ├── architecture.md     # Vue technique
│   ├── pedagogie.md        # Stratégie pédagogique
│   └── gestion-risques.md  # Guide formateur
└── .gitignore
```

## 🔄 Flux d'Utilisation

### Étudiant
1. Authentification → Dashboard perso
2. Consult mission en cours
3. Répond questions théoriques (variation réponses = progression)
4. Télécharge templates, complète analyses
5. Dépose deliverables → Attend validation prof
6. Accès test éval individuelle 20/20
7. Progresssion vers prochaine mission

### Formateur
1. Dashboard vue d'ensemble (Cohorte)
2. Alertes : "Doc déposé par Alice - Mission 1"
3. Consultation analyse étudiante
4. Validation/feedback via plateforme
5. Attribution scores individuels
6. Suivi progressions & indicateurs baromètre social

## 🛠️ Stack Technique

- **Backend** : Node.js + Express + JWT
- **Frontend** : React 18 + TailwindCSS
- **DB** : MongoDB (flexible pour évolutions)
- **Notifications** : WebSocket (temps réel)
- **Auth** : JWT + roles (etudiant/formateur)
- **Déploiement** : Docker-compose (dev/prod)

## 📅 Calendrier Séances

| Séance | Thème Principal | Missions |
|--------|-----------------|----------|
| **1** | Indicateurs RH & Recrutement | Audit recrutement COSMETICA, création tableau de bord |
| **2** | Budget RH & Masse Salariale | Analyse budget, PSE, adaptation activité |
| **3** | Performance & Turnover | Analyse turnover, absentéisme, productivité |
| **4** | Reporting & Baromètre Social | Rapport synthétique, baromètre RH complet |

## 🚀 Prochaines Étapes

1. [ ] Modélisation données (MongoDB schemas)
2. [ ] Création contenu pédagogique (missions, questions, cas)
3. [ ] Backend API core (auth, missions, validations)
4. [ ] Frontend interfaces (student/instructor)
5. [ ] Système notifications
6. [ ] Tests & déploiement

---

**Développé par** : Copilot Pédagogique RH | **Date** : 2026
