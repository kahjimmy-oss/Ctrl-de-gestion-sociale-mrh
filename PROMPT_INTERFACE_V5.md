# PROMPT À COLLER DANS CLAUDE.AI POUR GÉNÉRER L'INTERFACE COSMETICA™ V5

---

Crée-moi un fichier HTML **complet et autonome** (tout en un seul fichier — CSS + JS inline, aucune dépendance externe sauf Google Fonts) pour une interface pédagogique destinée à une promotion de **Master RH 1ère année** sur le **Contrôle de Gestion Sociale (CGS)**. L'entreprise fictive est **COSMÉTICA™**, PME cosmétique de 65 salariés, CA 2023 : 4 050 000€.

---

## 1. DESIGN & UX — IMPÉRATIFS VISUELS

- Interface **ultra-soignée, moderne, professionnelle** — digne d'un vrai outil RH d'entreprise
- Google Fonts : `Playfair Display` (titres, italic) + `Inter` (corps de texte)
- **Palette de couleurs :**
  - Fond crème : `#FAF7F2`
  - Fond chaud : `#F5EFE4`
  - Or principal : `#C8A96E` | Or foncé : `#A8893E` | Or clair : `#FDF5E4`
  - Rose terracotta : `#C4715A` | Fond rose : `#FDECEA`
  - Teal profond : `#2D6E6A` | Fond teal : `#E4F5F3`
  - Ardoise : `#3D4A5C`
  - Encre (fond dark) : `#0E0C0A`
  - Vert succès : `#1A6E42` | Ambre alerte : `#8A5208` | Rouge danger : `#B03030`
- **Cards** avec ombres douces, border-radius 12px, hover avec translateY(-3px)
- **Sidebar fixe** à gauche (248px), zone principale scrollable à droite
- **Topbar fixe** avec logo, progression, avatar initiales, déconnexion
- **Scrollbar** personnalisée (fine, dorée)
- **Transitions CSS** fluides sur toutes les interactions (0.15s ease)
- **Responsive** : sidebar masquée sur mobile (<700px)
- **Modals** avec overlay backdrop-filter blur pour les dossiers salariés
- **Toasts** de notification (bas droite, auto-disparition 3,2s)
- Police 14px base, line-height 1.65

---

## 2. STRUCTURE GÉNÉRALE

### SPLASH PAGE (connexion)
- Fond `#0E0C0A` avec gradient radial doré subtil
- Côté gauche : logo COSMÉTICA™, titre "Atelier Contrôle de Gestion Sociale", sous-titre, stats (65 salariés · 3 séances · 4,05M€ CA · 10 dossiers)
- Côté droit (fond crème) : formulaire "Prénom et Nom" + bouton "Entrer dans COSMÉTICA™ →"
- Note : "Votre progression est sauvegardée automatiquement dans votre navigateur."

### TOPBAR FIXE (après connexion)
- Logo "✦ COSMÉTICA™" + "Atelier CGS · Master RH"
- Pill progression : "X / 3 séances"
- Avatar (2 initiales, dégradé or/rose) + nom
- Bouton déconnexion

### SIDEBAR GAUCHE
Sections :
1. **Navigation** : Accueil 🏠 | Boîte mail ✉️ (badge nombre non-lus) | Dossiers salariés 👥 | Données RH & Finances 📊
2. **Séances** : Séance 1 (accessible) | Séance 2 (🔒 si S1 non faite) | Séance 3 (🔒 si S2 non faite)
3. **Progression** : barre dorée + "X / 3 séances complétées"
4. **Alertes RH actives** : 4 lignes (rouge/orange)
   - Turnover commercial : 40% (rouge)
   - Dépassement MS : +147 400€ (rouge)
   - 3 situations TMS actives (orange)
   - Burn-out RH latent — Sophie Martin (orange)

---

## 3. BOÎTE MAIL FICTIVE ✉️ (NOUVELLE FONCTIONNALITÉ IMPORTANTE)

Interface style webmail en 2 colonnes :
- **Colonne gauche** (liste mails, 38%) : chaque mail = avatar couleur + expéditeur gras + objet en italic + aperçu 1 ligne + date + badge "Non lu" (point doré)
- **Colonne droite** (corps du mail, 62%) : en-tête sombre avec avatar, nom, rôle, objet, date → corps du mail stylisé
- Clic sur un mail → marquer comme lu (badge disparaît)
- Bouton "Répondre" désactivé avec tooltip "En séance, la réponse se fait à l'oral"
- Counter sidebar mis à jour automatiquement

**6 mails pré-écrits :**

**Mail 1** — De : Isabelle BERNARD (ibernard@cosmetica.fr) — DG | 15 jan. 2024
Objet : "Urgence CODIR — Diagnostic turnover commercial à produire avant vendredi"
Corps : "Bonjour, Je viens de recevoir le rapport de Sophie Martin. Le turnover de notre département commercial est alarmant. Marc Durand invoque 'la faute du marché'. Sophie dit que c'est le management. J'ai besoin d'un diagnostic RH objectif et entièrement chiffré avant le CODIR de vendredi 19 janvier. Alice Benoît vient de confirmer sa rupture conventionnelle — 4ème départ commercial en 18 mois. Elle gérait les comptes Sephora et Marionnaud. Ces comptes ne sont pas transférés à ce jour. Je vous attends avec des chiffres précis, pas des estimations. — Isabelle Bernard, DG"

**Mail 2** — De : Nathalie LEBLANC (nleblanc@cosmetica.fr) — Contrôleure de Gestion | 5 fév. 2024
Objet : "URGENT — Dépassement MS 2023 : +147 400€ — Analyse requise avant CODIR"
Corps : "Bonjour, Je viens de boucler les comptes 2023. La masse salariale chargée a dépassé le budget de 147 400€. J'ai identifié certaines causes mais un solde important reste non ventilé. Marc Durand propose un PSE sur 8 postes dont 5 commerciaux. Sophie Martin s'y oppose et propose des alternatives. Isabelle Bernard attend une analyse comparative des deux options avant vendredi. J'ai besoin que vous me fournissiez la décomposition complète de cet écart, cause par cause, avec la qualification conjoncturel/structurel. Chaque euro doit être justifié. — Nathalie Leblanc, CG"

**Mail 3** — De : Sophie MARTIN (smartin@cosmetica.fr) — RRH | 12 mars 2024
Objet : "SOS — 4 urgences RH simultanées — J'ai besoin de vous maintenant"
Corps : "Bonjour, Ce matin c'est la tempête. → Patrick Chevalier : nouvel arrêt de 3 mois. Le remplaçant intérimaire coûte 500€/jour. → Corinne Vidal : le médecin du travail exige un aménagement de poste sous 30 jours. Risque de faute inexcusable si on ne bouge pas. → Amandine Moreau : son avocat nous a envoyé un recommandé AR hier. → Julie Petit : entretien dans une autre entreprise demain matin. Il me faut un baromètre social complet et un plan d'action priorisé avec les coûts. Aujourd'hui. — Sophie Martin, RRH"

**Mail 4** — De : Dr. Françoise DUPUIS (fdupuis@sst-cosmetica.fr) — Médecin du travail | 10 mars 2024
Objet : "Mise en demeure formelle — Aménagements de postes Vidal & Chevalier"
Corps : "Madame Martin, Je me permets de vous relancer formellement. Mes préconisations d'aménagement de poste concernant Mme Vidal (maladie professionnelle tendinite reconnue — rotation de poste max 2h sur gestes répétitifs) et M. Chevalier (hernies discales L4-L5 — suppression charges >5kg, poste assis/debout) n'ont pas été mises en œuvre. Je vous rappelle que l'inaction de l'employeur après préconisation médicale documentée peut constituer une faute inexcusable engageant la responsabilité pénale et financière de l'entreprise. Je vous accorde 30 jours pour me transmettre un plan d'action formalisé. — Dr. Françoise Dupuis, Médecin du travail COSMÉTICA™"

**Mail 5** — De : Robert TESSIER (rtessier-cse@cosmetica.fr) — Délégué CSE | 8 mars 2024
Objet : "Saisine CSE — Refus temps partiel Amandine Moreau — Demande réunion extraordinaire"
Corps : "Madame Martin, Le CSE est saisi du cas de Mme Amandine Moreau. Sa demande de passage à 80% pour contrainte familiale (enfant en situation de handicap) a été refusée verbalement sans aucun écrit motivé en octobre 2023. Nous rappelons que le refus d'une demande de temps partiel sans motif légitime documenté est susceptible de constituer une discrimination indirecte. Le Conseil a mandaté un avocat qui a adressé un recommandé à la direction le 15 janvier 2024. Nous demandons la tenue d'une réunion extraordinaire dans les 8 jours. — Robert Tessier, Délégué CSE"

**Mail 6** — De : Marc DURAND (mdurand@cosmetica.fr) — Directeur Commercial | 20 fév. 2024
Objet : "Ma proposition pour redresser la situation — Restructuration équipe commerciale"
Corps : "Isabelle, Je t'adresse en copie Sophie et Nathalie. Face au dépassement MS, je propose un PSE ciblant 8 postes dont 5 dans mon équipe. Je précise que les départs de 2023 sont entièrement liés à la conjoncture du marché cosmétique, très volatile. Les profils sont remplaçables. L'économie MS annuelle serait immédiate. J'estime que c'est la seule solution pour respecter l'objectif 60% de ratio MS/CA. Je reste disponible pour présenter ce plan au CODIR. — Marc Durand, Directeur Commercial"

---

## 4. DOSSIERS SALARIÉS 👥

Grille responsive (auto-fill minmax 255px). Chaque card affiche **de manière homogène et standardisée** :
- Avatar initiales + couleur unique par personne
- Nom complet (bold)
- **Étiquette STATUT** : `Cadre dirigeant` / `Cadre` / `ETAM` / `Ouvrier` — badge ardoise
- **Étiquette POSTE** : intitulé exact — badge or léger
- **Salaire brut mensuel** en vert doré
- **Ancienneté**
- Tags contextuels (2-3 max, neutres — facts only, pas d'interprétation)
- Note 1 ligne : fait objectif uniquement, **pas de taux ni de résultats calculés**
- Badge risque coloré (Critique rouge / Élevé orange / Modéré or / Faible vert)

**RÈGLE ABSOLUE pour les dossiers :** Ne jamais inclure de taux calculés (pas de "taux d'absentéisme : X%", pas de "coût total : X€"). Donner uniquement les données brutes (heures d'absence, jours, montants unitaires). Les étudiantes calculent elles-mêmes.

### Les 11 dossiers salariés (DONNÉES EXACTES À UTILISER) :

**[1] ALICE BENOÎT** ← DOSSIER COMPLET À CRÉER
- id: e_alice | init: "AB" | color: "#7a5c8a"
- Statut: ETAM | Poste: Chargée Grands Comptes | Dept: Commercial
- Salaire: 3 800€ brut/mois | Variable: 3 200€/an | Ancienneté: 4 ans
- Tags: ["ETAM", "Rupture conventionnelle", "Comptes stratégiques perdus"]
- Note card (factuelle): "Départ mars 2024. Portefeuille Sephora + Marionnaud non transféré."
- Risque: critique | Badge: "🔴 Départ effectif"
- **Dossier complet (modal) :**
  - Date entrée : 15 janvier 2020 | Date sortie : 31 mars 2024
  - Type départ : Rupture conventionnelle (signée 28 fév. 2024)
  - Contrat : CDI temps plein 35h/semaine
  - Comptes gérés : Sephora (CA annuel 28 000€) + Marionnaud (CA annuel 25 500€) → Total portefeuille : 53 500€/an
  - Entretien de sortie : "Management trop directif, aucune perspective d'évolution, aucune révision salariale depuis 3 ans"
  - Données absences (données brutes, pas de taux) :
    - 2021 : 0 heure d'absence
    - 2022 : 0 heure d'absence
    - 2023 : 8 heures d'absence (1 jour maladie ordinaire)
  - Heures théoriques annuelles de référence : 1 607 heures
  - Jours ouvrés de référence 2023 : 228 jours
  - Éléments pour calcul indemnité rupture : ancienneté 4 ans 2 mois, formule légale 1/4 de mois de salaire brut par année d'ancienneté (à calculer par les étudiantes)
  - Profil : Spécialiste GMS cosmétique bio, 6 ans d'expérience secteur avant COSMÉTICA™

**[2] SOPHIE MARTIN**
- init: "SM" | color: "#c4715a"
- Statut: Cadre | Poste: Responsable RH | Dept: RH | Sal: 4 200€/mois | Anc: 10 ans
- Tags: ["Cadre", "RRH", "Surcharge chronique"]
- Note card: "Gère 65 salariés avec 1 seule alternante (3j/sem). Alerte burn-out documentée jan. 2024."
- Risque: élevé
- **Dossier modal :**
  - Équipe RH : 2 personnes (Sophie + Chloé Lambert, alternante 3j/semaine)
  - Alerte transmise à la DG : janvier 2024 (surcharge documentée)
  - Absences 2023 : 64 heures (8 jours maladie)
  - Absences 2022 : 16 heures (2 jours)
  - Absences 2021 : 0 heure
  - Heures théoriques 2023 : 1 607 heures
  - Temps consacré aux 8 recrutements 2023 : environ 3 jours par recrutement (entretiens + admin + intégration)
  - Coût journalier chargé (à calculer) : 4 200€ × 1,42 ÷ 21,5j

**[3] MARC DURAND**
- init: "MD" | color: "#3d4a5c"
- Statut: Cadre | Poste: Directeur Commercial | Dept: Commercial | Sal: 5 500€/mois | Anc: 8 ans
- Tags: ["Cadre", "CA +35% en 3 ans", "4 démissions équipe"]
- Note card: "CA commercial +35% sur 3 ans. 4 démissions depuis son arrivée en 2016."
- Risque: critique
- **Dossier modal :**
  - CA équipe commerciale 2023 : 2 050 000€ (50,6% du CA total)
  - Départs depuis son arrivée (2016) : 4, dont 2 en 2023
  - Entretiens de sortie 2023 : "pression constante", "objectifs irréalistes", "absence de reconnaissance"
  - Formation management suivie juin 2023 : 2 jours, 1 800€ — impact constaté : aucun
  - Absences 2023 : 0 heure
  - Coût journalier chargé (à calculer) : 5 500€ × 1,42 ÷ 21,5j

**[4] JULIE PETIT**
- init: "JP" | color: "#c8a96e"
- Statut: ETAM | Poste: Commerciale Senior | Dept: Commercial | Sal: 3 100€/mois + var. 4 800€/an | Anc: 5 ans
- Tags: ["ETAM", "Talent critique", "Offre externe en cours"]
- Note card: "Gère 28% du CA. Refus augmentation. Entretien concurrent en cours."
- Risque: critique
- **Dossier modal :**
  - Portefeuille : Galeries Lafayette (CA 380 000€/an) + Printemps (CA 210 000€/an)
  - CA total géré : 1 134 000€ (28% du CA COSMÉTICA™)
  - Offre externe reçue : 3 800€ fixe mensuel
  - Augmentation refusée : +400€/mois (demande formulée oct. 2023)
  - Absences (données brutes, pas de taux) :
    - 2021 : 32 heures (4 jours)
    - 2022 : 56 heures (7 jours)
    - 2023 : 144 heures (18 jours)
  - Heures théoriques annuelles : 1 607 heures

**[5] PATRICK CHEVALIER**
- init: "PC" | color: "#5d7fa8"
- Statut: ETAM | Poste: Responsable Logistique | Dept: Logistique | Sal: 3 200€/mois | Anc: 11 ans
- Tags: ["ETAM", "TMS chronique reconnu", "Absences récurrentes"]
- Note card: "Hernies discales L4-L5 reconnues 2022. 3 épisodes d'arrêt en 2023."
- Risque: élevé
- **Dossier modal :**
  - Pathologie : hernies discales L4-L5 reconnues maladie professionnelle 2022
  - Absences 2023 : 336 heures réparties en 3 épisodes (112h + 144h + 80h)
  - Absences 2022 : 176 heures
  - Absences 2021 : 64 heures
  - Heures théoriques 2023 : 1 607 heures
  - Coût intérim remplacement : 500€/jour HT (agence spécialisée logistique)
  - Préconisation médecin du travail juil. 2023 : suppression charges >5kg, poste assis/debout alterné
  - Coût aménagement estimé : 4 500€ (siège ergonomique + table réglable + réorganisation flux)
  - Sans aménagement : risque déclaration inaptitude dans les 6 mois selon médecin du travail
  - Si inaptitude : indemnités légales = 1/4 mois × ancienneté (à calculer) + recrutement estimé 15 000-20 000€ + formation 3 mois

**[6] CORINNE VIDAL**
- init: "CV" | color: "#8a6d5a"
- Statut: Ouvrier | Poste: Opératrice Production (ligne conditionnement) | Dept: Production | Sal: 1 920€/mois | Anc: 8 ans
- Tags: ["Ouvrier", "Maladie professionnelle", "Mise en demeure active"]
- Note card: "Tendinite épaule droite reconnue MP mai 2023. Mise en demeure aménagement sous 30j."
- Risque: critique
- **Dossier modal :**
  - MP reconnue : tendinite épaule droite (gestes répétitifs, cadence 6h/jour sur ligne conditionnement)
  - Absences 2023 : 280 heures (35 jours — arrêt MP mai-juin 2023)
  - Absences jan. 2024 : 112 heures (14 jours — rechute)
  - Absences 2022 : 0 heure
  - Heures théoriques 2023 : 1 607 heures
  - Coût intérim remplacement : 420€/jour HT
  - Aménagement préconisé : rotation de poste (max 2h sur gestes répétitifs/jour) + équipement protection épaule
  - Risque faute inexcusable si inaction prouvée après préconisation médicale documentée
  - Si inaptitude + licenciement : indemnités légales 1/4 mois × 8 ans (à calculer) + recrutement opératrice 4 500-6 000€ + formation 6 semaines

**[7] AMANDINE MOREAU**
- init: "AM" | color: "#7a5c8a"
- Statut: Ouvrier | Poste: Opératrice Production | Dept: Production | Sal: 1 820€/mois | Anc: 6 ans
- Tags: ["Ouvrier", "Temps partiel refusé", "Contentieux en cours"]
- Note card: "Demande 80% refusée verbalement sans écrit. Enfant handicapé. Avocat mandaté."
- Risque: élevé
- **Dossier modal :**
  - Demande temps partiel 80% (28h/sem) : déposée oct. 2023, motif contrainte familiale (enfant en situation de handicap)
  - Réponse RH : refus verbal, sans écrit, sans motif documenté
  - TMS naissants diagnostiqués déc. 2023 : tendinite poignet gauche
  - Absences déc. 2023 : 24 heures (3 jours)
  - Recommandé AR reçu jan. 2024 : avocat, invoque discrimination indirecte
  - Impact passage 80% sur MS : -364€/mois brut = -4 368€/an
  - Risque prud'homal : dommages-intérêts de 6 mois à 2 ans de salaire

**[8] KARIM FONTAINE**
- init: "KF" | color: "#2d7a45"
- Statut: Cadre | Poste: Chef de Projet R&D | Dept: R&D | Sal: 4 800€/mois + prime 3 000€/an | Anc: 7 ans
- Tags: ["Cadre", "Talent clé", "Contre-proposition acceptée"]
- Note card: "Créateur gamme EcoPure (57% du CA). Contre-proposition acceptée. Horizon départ : 18 mois."
- Risque: modéré
- **Dossier modal :**
  - Formations : Docteur en chimie cosmétique (Paris 6)
  - Gamme EcoPure créée 2018-2021 : 14 formules brevetées, CA 2023 : 2 310 000€
  - Offre concurrente sept. 2023 : 5 800€/mois
  - Contre-proposition acceptée : +600€/mois + prime 3 000€/an + budget R&D +15 000€
  - Déclaration : "pour 18 mois maximum"
  - 3 nouvelles formules en développement (investissement déjà engagé : 32 000€)
  - Aucun plan de succession en place

**[9] NATHALIE LEBLANC**
- init: "NL" | color: "#4a6e5a"
- Statut: Cadre | Poste: Contrôleure de Gestion | Dept: Finance | Sal: 4 100€/mois | Anc: 9 ans
- Tags: ["Cadre", "Contrôle de gestion", "Rapport écarts MS 2023"]
- Note card: "A produit le rapport dépassement MS +147 400€. Demande KPIs sociaux mensuels."
- Risque: faible
- **Dossier modal :**
  - A produit le rapport d'analyse MS en décembre 2023
  - Demande mensuelle à la RH : taux absentéisme, coût intérim lié aux absences, délai et coût moyen recrutement, taux rétention 6 mois

**[10] HENRI DUPONT**
- init: "HD" | color: "#5a6e7a"
- Statut: ETAM | Poste: Responsable Paie | Dept: Finance | Sal: 3 600€/mois | Anc: 10 ans
- Tags: ["ETAM", "Migration SIRH", "Redressement URSSAF"]
- Note card: "Gère la paie de 65 salariés seul. Erreur DSN nov. 2023 → redressement URSSAF."
- Risque: modéré
- **Dossier modal :**
  - Migration SIRH sept. 2023 (Silae → Sage HRLine) : formation reçue = 4 heures (recommandé : 2 jours)
  - Erreur DSN nov. 2023 : 3 cotisations mal classifiées
  - Redressement URSSAF notifié jan. 2024 : 3 400€
  - Coût formation Sage HRLine complète : 1 200€ (2 jours inter-entreprises)

**[11] ISABELLE BERNARD**
- init: "IB" | color: "#2d6e6a"
- Statut: Cadre dirigeant | Poste: Directrice Générale | Dept: Direction | Sal: 7 200€/mois | Anc: 13 ans
- Tags: ["Cadre dirigeant", "Co-fondatrice", "Objectif MS/CA ≤ 60%"]
- Note card: "Co-fondatrice 2011. Objectif fixé : ramener ratio MS/CA sous 60% d'ici fin 2024."
- Risque: faible

---

## 5. DONNÉES RH & FINANCIÈRES 📊

**RÈGLE FONDAMENTALE :** Fournir uniquement les **données brutes** (effectifs, heures, montants, jours). **NE PAS calculer les taux ni les ratios** — les étudiantes s'en chargent. Exception : les benchmarks sectoriels (valeurs externes, pas des résultats COSMÉTICA™).

### SECTION A — Données de base pour les calculs

**Tableau "Données de référence 2023 — COSMÉTICA™"**
| Donnée | Valeur | Précision |
|---|---|---|
| Effectif au 01/01/2023 | 63 salariés | |
| Effectif au 31/12/2023 | 65 salariés | Dont 2 CDD internes |
| ETP réels (hors absences longues) | 58,5 ETP | À utiliser pour calcul productivité |
| **Entrées 2023** | **8 personnes** | Dont 4 commerciaux, 2 production, 2 autres |
| **Sorties 2023** | **8 personnes** | Dont 4 départs commerciaux, 2 production, 2 autres |
| dont départs volontaires | 5 | Dont 4 liés à l'équipe Durand |
| dont ruptures conventionnelles | 2 | Alice Benoît + 1 autre |
| dont licenciements | 1 | |
| Jours ouvrés 2023 | **228 jours** | Base légale 35h + 25 CP + 11 fériés |
| **Heures théoriques annuelles / ETP** | **1 607 heures** | Base de calcul absentéisme |
| CA 2023 | 4 050 000€ | |

**Encadré "Formules à utiliser" :**
```
Turnover = (Entrées + Sorties) ÷ 2 ÷ Effectif moyen × 100
Effectif moyen = (Effectif début + Effectif fin) ÷ 2

Taux d'absentéisme = Heures d'absence ÷ (Effectif × Heures théoriques) × 100
ou : Taux d'absentéisme = Heures d'absence ÷ Heures théoriques totales × 100

Coût journalier chargé = Salaire brut mensuel × 1,42 ÷ 21,5 jours
Ratio MS/CA = MS chargée ÷ CA × 100
Indemnité rupture conv. = 1/4 mois de salaire brut × nombre d'années d'ancienneté
```

### SECTION B — Masse Salariale 2023

**Tableau "Structure MS 2023 — Données brutes"**
| Composante | Montant | Note |
|---|---|---|
| MS brute totale (65 salariés) | 1 820 000€ | Salaires bruts annuels |
| Charges patronales | 762 400€ | Taux = à calculer |
| **MS chargée réalisée** | **2 582 400€** | |
| MS chargée budgétée | 2 435 000€ | |
| **Écart MS vs budget** | **+147 400€** | À décomposer cause par cause |
| CA 2023 | 4 050 000€ | |
| Objectif ratio MS/CA (DG) | ≤ 60% | **Ratio réalisé = à calculer** |

### SECTION C — Absences 2023 par département (heures brutes)

**Tableau "Heures d'absence par département 2023"** — DONNÉES BRUTES UNIQUEMENT

| Département | Effectif | H. théoriques totales | H. absence 2023 | Équivalent jours | Taux = à calculer |
|---|---|---|---|---|---|
| Direction | 1 | 1 607h | 0h | 0j | — |
| RH | 2 | 3 214h | 64h | 8j | — |
| Commercial | 9 | 14 463h | 152h | 19j | — |
| Production | 20 | 32 140h | 648h | 81j | — |
| Logistique | 8 | 12 856h | 344h | 43j | — |
| Finance | 4 | 6 428h | 0h | 0j | — |
| R&D | 4 | 6 428h | 0h | 0j | — |
| Marketing | 5 | 8 035h | 72h | 9j | — |
| Qualité | 4 | 6 428h | 16h | 2j | — |
| **TOTAL** | **57** | **91 599h** | **1 296h** | **162j** | **= à calculer** |

Note : "Calculez le taux d'absentéisme global et par département. Comparez au benchmark France (4,9% en 2023). Identifiez les départements en situation d'alerte."

Benchmarks à afficher (valeurs secteur, pas COSMÉTICA™) :
- Absentéisme France tous secteurs 2023 : 4,9%
- Absentéisme industrie/PME : 5,2%
- Seuil d'alerte entreprise : > 5%
- Turnover PME France : ~10%
- Turnover cosmétique/distribution : ~15%
- Ratio MS/CA cosmétique PME : 55-60%
- Taux rétention 6 mois recruté : > 80%
- Productivité/ETP secteur : ~65 000€

### SECTION D — Écarts budgétaires 2023

**Tableau "Écarts budgétaires RH 2023"**
| Poste | Budget | Réalisé | Écart | Statut |
|---|---|---|---|---|
| Masse salariale | 2 435 000€ | 2 582 400€ | +147 400€ | 🔴 |
| Formation | 85 000€ | 62 000€ | -23 000€ | 🟡 |
| Recrutement | 42 000€ | 68 000€ | +26 000€ | 🔴 |
| Intérim / Remplacement | 30 000€ | 78 000€ | +48 000€ | 🔴 |

**Tableau "Causes partiellement identifiées — Écart MS +147 400€"**
| Cause identifiée | Montant unitaire | Calcul à compléter |
|---|---|---|
| Contre-proposition Karim Fontaine | +600€/mois × 12 + prime 3 000€ | = ___ |
| Intérim Patrick Chevalier (42 jours) | 500€/jour | = ___ |
| Intérim Corinne Vidal (35 jours) | 420€/jour | = ___ |
| Indemnité rupture conv. Alice Benoît | 1/4 mois × 4 ans d'ancienneté | = ___ |
| Recrutements en urgence (8 en 2023, dont 4 urgents) | Coût estimé 8 500€ en moyenne | = ___ |
| Redressement URSSAF Henri Dupont | 3 400€ | = 3 400€ |
| **Solde non ventilé** | **À identifier et justifier** | = ??? |
| **TOTAL** | | **= 147 400€** |

### SECTION E — Répartition par CSP et Département (NOUVEAU)

**Tableau double entrée "Répartition des effectifs par CSP et Département"**
| Département | Cadres | ETAM | Ouvriers | Total | MS brute annuelle dept |
|---|---|---|---|---|---|
| Direction | 1 | 0 | 0 | 1 | 86 400€ |
| RH | 1 | 1 | 0 | 2 | 98 400€ |
| Commercial | 2 | 7 | 0 | 9 | 387 600€ |
| Production | 1 | 4 | 15 | 20 | 395 800€ |
| Logistique | 1 | 5 | 2 | 8 | 246 400€ |
| Finance | 1 | 3 | 0 | 4 | 180 000€ |
| R&D | 2 | 2 | 0 | 4 | 187 200€ |
| Marketing | 1 | 4 | 0 | 5 | 155 400€ |
| Qualité | 1 | 2 | 1 | 4 | 83 200€ |
| **TOTAL** | **11** | **28** | **18** | **57** | **1 820 400€** |

Note : "2 CDD courts exclus de l'effectif légal, 6 intérimaires non inclus"

**Tableau "MS par CSP — Données de base"**
| CSP | Effectif | MS brute annuelle totale | Salaire brut moyen annuel | Coût chargé moyen/j (à calculer) |
|---|---|---|---|---|
| Cadres (dont 2 cadres dirigeants) | 11 | 620 000€ | 56 364€ | = à calculer |
| ETAM | 28 | 780 000€ | 27 857€ | = à calculer |
| Ouvriers / Opérateurs | 18 | 420 000€ | 23 333€ | = à calculer |
| **Total** | **57** | **1 820 000€** | **31 930€** | |

### SECTION F — Données de référence recrutement

| Donnée | Valeur | Précision |
|---|---|---|
| Délai moyen recrutement COSMÉTICA™ 2023 | 68 jours | Benchmark secteur : 45-55j |
| Délai commercial senior cosméto bio | 90-120 jours | Marché tendu |
| Délai opérateur production | 30-45 jours | Marché local disponible |
| Délai Resp. Logistique expérimenté | 45-60 jours | |
| Délai Chef projet R&D docteur | 4 à 6 mois | Profil très rare |
| Coût recrutement commercial (annonces + temps RH/manager + intégration) | 12 000 à 18 000€ | |
| Coût recrutement opérateur | 4 500 à 6 000€ | |
| Formation commercial junior → autonomie partielle | 6 mois | |
| Formation commercial junior → pleine productivité | 12 mois | |
| Perte CA pendant vacance commercial | 100% du portefeuille à risque | |
| Perte CA commercial pendant formation (6-12 mois) | 30 à 40% vs titulaire | |
| Taux rétention 6 mois 2023 (COSMÉTICA™) | 2 départs sur 8 recrutements avant 6 mois | = à calculer en % |
| Nombre recrutements réalisés 2023 | 8 | Dont 4 en urgence (délai contraint) |

---

## 6. QCM — 10 QUESTIONS RÉPARTIES SUR LES 3 SÉANCES

**Système :** 3 ou 4 questions par séance. Le score s'affiche après chaque réponse avec explication pédagogique. La mission se déverrouille après avoir répondu à toutes les questions (peu importe le score — l'objectif est pédagogique, pas éliminatoire). Afficher le score final ("Vous avez X/Y bonnes réponses").

**Variété obligatoire :** mélanger VRAI/FAUX et QCM 3-4 options. Formuler les pièges de manière subtile.

### SÉANCE 1 — Audit Recrutement (3 questions)

**Q1 — VRAI ou FAUX**
"Le taux de turnover d'un département se calcule en divisant le nombre de départs du département par l'effectif total de l'entreprise."
- A) VRAI — on utilise l'effectif total comme base de référence commune
- B) **FAUX ← CORRECT** — le turnover d'un département se calcule sur l'effectif de CE département : (Entrées dept + Sorties dept) / 2 / Effectif dept × 100
Feedback FAUX : "Exact ! Le turnover se calcule toujours sur la population concernée. Pour le département commercial de COSMÉTICA™ : (4+4)/2/9 × 100. Utiliser l'effectif total de l'entreprise diluerait le résultat et masquerait la réalité du département."
Feedback VRAI : "Attention — le turnover d'un département se calcule sur l'effectif de CE département, pas de toute l'entreprise. Diviser par 65 salariés diluerait le problème commercial. La formule exacte : (Entrées dept + Sorties dept) / 2 / Effectif dept × 100."

**Q2 — QCM 4 options**
"Parmi ces éléments, lequel N'est PAS inclus dans le coût de remplacement d'un salarié ?"
- A) Les frais d'annonce de recrutement et de sourcing
- B) La perte de productivité pendant la vacance du poste
- C) **Le solde des congés payés acquis non pris ← CORRECT**
- D) Le temps passé par le responsable RH et le manager aux entretiens
Feedback C : "Exact ! Les congés payés acquis sont une charge légale qui existe indépendamment du départ — elle aurait été payée de toute façon (prise ou indemnisée). Le coût de remplacement couvre : recrutement (annonces + temps RH/manager) + vacance de poste + formation/montée en compétences du remplaçant."
Feedback autre : "Le solde de congés payés est exclu du coût de remplacement car c'est une charge légale préexistante, indépendante du départ. Elle aurait été payée qu'il y ait départ ou non."

**Q3 — QCM 3 options**
"Alice Benoît gère le compte Sephora (CA : 28 000€/an) et le compte Marionnaud (CA : 25 500€/an). Son salaire brut mensuel est de 3 800€. Si son poste reste vacant 90 jours après son départ, quelle information supplémentaire est indispensable pour calculer le coût de vacance ?"
- A) Le nombre de commerciaux restants dans l'équipe
- B) **Le taux de perte estimé sur le CA pendant la vacance ← CORRECT**
- C) Le montant des charges patronales applicables
Feedback B : "Exact ! La vacance de poste ne signifie pas forcément 100% de perte CA — une redistribution partielle est possible. Sans connaître le taux de perte (estimé entre 30% et 100% selon le contexte), impossible de chiffrer le manque à gagner. Pour COSMÉTICA™, la DG estime que 60% du portefeuille Alice est à risque pendant la vacance."
Feedback autre : "L'information clé manquante est le taux de perte sur le CA. Le nombre de collègues et les charges patronales ne permettent pas de quantifier ce que l'entreprise perd réellement pendant que le poste est vacant."

### SÉANCE 2 — Budget & Masse Salariale (3 questions)

**Q4 — VRAI ou FAUX**
"Réduire le dépassement de masse salariale implique obligatoirement soit de licencier des salariés, soit de baisser leurs salaires individuels."
- A) **FAUX ← CORRECT** — de nombreux leviers existent avant d'en arriver là
- B) VRAI — ce sont les seuls moyens légaux de réduire la MS
Feedback FAUX : "Exact ! Les leviers de réduction MS sans licenciement ni baisse de salaire : gel des augmentations et primes variables, non-renouvellement des CDD et intérim, APLD (réduction du temps de travail jusqu'à 40% avec aide de l'État), mobilité interne, réduction des heures supplémentaires. Pour COSMÉTICA™ : le seul poste intérim représente 78 000€ réalisé vs 30 000€ budgété."
Feedback VRAI : "Faux — il existe de nombreux leviers avant de toucher aux rémunérations. La réduction des salaires individuels est exceptionnelle et très encadrée (accord collectif). Chez COSMÉTICA™, la réduction du recours à l'intérim seule permettrait d'économiser ~48 000€."

**Q5 — QCM 4 options**
"COSMÉTICA™ a une MS chargée de 2 582 400€ et un CA de 4 050 000€. La DG fixe un objectif de ratio MS/CA ≤ 60%. De combien faut-il réduire la MS chargée pour atteindre cet objectif ?"
- A) 47 400€
- B) **152 400€ ← CORRECT**
- C) 94 800€
- D) 207 600€
Feedback B : "Exact ! MS cible = 4 050 000 × 60% = 2 430 000€. Réduction nécessaire = 2 582 400 - 2 430 000 = 152 400€. Le ratio actuel est à calculer (2 582 400 / 4 050 000 × 100). La réduction est substantielle — c'est pourquoi il faut combiner plusieurs leviers."
Feedback autre : "Rappel du calcul : MS cible à 60% = CA × 0,60 = 4 050 000 × 0,60 = 2 430 000€. Réduction nécessaire = MS réalisée - MS cible = 2 582 400 - 2 430 000 = 152 400€."

**Q6 — QCM 4 options**
"L'APLD (Activité Partielle Longue Durée) permet à COSMÉTICA™ de réduire la MS. Quelle est la condition juridique principale pour y recourir ?"
- A) L'accord écrit individuel de chaque salarié concerné
- B) L'autorisation préalable de l'Inspection du Travail
- C) Un effectif minimum de 50 salariés (seuil PSE)
- D) **La conclusion d'un accord collectif ou d'un document unilatéral homologué par la DREETS ← CORRECT**
Feedback D : "Exact ! L'APLD nécessite soit un accord collectif (signé par syndicats représentatifs), soit un PSE unilatéral soumis à consultation du CSE puis homologué par la DREETS. Elle permet une réduction du temps de travail jusqu'à 40%, avec l'État qui prend en charge 60% de la rémunération des heures non travaillées — soit une économie nette réelle pour l'employeur."
Feedback autre : "L'APLD est conditionnée à un accord collectif ou un document unilatéral validé par la DREETS (Direction régionale de l'économie). Les accords individuels ne suffisent pas. Elle ne requiert pas d'atteindre le seuil du PSE."

### SÉANCE 3 — Performance, RPS & Baromètre (4 questions)

**Q7 — VRAI ou FAUX**
"Un taux d'absentéisme global de 5% dans une entreprise signifie que chaque salarié a été absent en moyenne 5% du temps sur l'année."
- A) VRAI — c'est la définition de ce taux
- B) **FAUX ← CORRECT** — c'est un taux collectif qui masque des situations très disparates
Feedback FAUX : "Exact ! Un taux collectif de 5% peut cacher des départements à 0% et d'autres à 25%. Dans COSMÉTICA™, le département logistique et la production ont des situations radicalement différentes du département finance (0 heure d'absence). Un taux global masque toujours les situations critiques individuelles — d'où l'importance du calcul par département et par personne."
Feedback VRAI : "Non — c'est une erreur classique d'interprétation. Le taux d'absentéisme est un indicateur collectif moyen. Un même taux de 5% peut correspondre à 1 personne absente 100% du temps pendant 18 jours, ou à toute l'équipe absente 5% du temps. Le détail par service et par individu est indispensable."

**Q8 — QCM 4 options**
"Corinne Vidal a une maladie professionnelle reconnue. Si l'entreprise est condamnée pour faute inexcusable, quelle est la conséquence financière principale pour COSMÉTICA™ ?"
- A) Une amende forfaitaire fixée par l'Inspection du Travail
- B) Le remboursement uniquement des indemnités journalières déjà versées par la CPAM
- C) **La majoration de la rente AT/MP et le remboursement à la CPAM de toutes ses dépenses liées à l'accident ← CORRECT**
- D) Le versement d'une indemnité équivalente à 6 mois de salaire brut
Feedback C : "Exact ! La faute inexcusable entraîne : (1) majoration automatique de la rente de la victime, (2) remboursement intégral à la CPAM de toutes ses dépenses (soins, IJ, rente), (3) indemnisation complémentaire du préjudice de la victime. Le montant total peut dépasser 50 000 à 100 000€ selon la gravité. C'est pourquoi une inaction face à une préconisation médicale documentée est si risquée."
Feedback autre : "La faute inexcusable est une des sanctions les plus lourdes du droit du travail. Elle entraîne le remboursement intégral à la CPAM (pas seulement les IJ) et la majoration de la rente. Il n'y a pas d'amende forfaitaire — le montant est calculé au réel."

**Q9 — QCM 3 options**
"Dans quel ordre devriez-vous prioriser les 3 actions suivantes si vous n'avez qu'un budget de 5 000€ pour cette semaine ?"
- A) **Répondre par écrit à Amandine Moreau (quasi-gratuit) + Entretien fidélisation Julie Petit (gratuit) + Commencer le dossier aménagement Patrick ← CORRECT**
- B) Déclencher l'aménagement de poste Patrick Chevalier (4 500€) en priorité absolue
- C) Constituer immédiatement le baromètre social (1 500€ d'outil) avant toute autre action
Feedback A : "Excellent raisonnement ! La réponse écrite à Amandine coûte 2h de travail RH et stoppe le risque juridique immédiat (discrimination prouvée si silence). L'entretien Julie est gratuit et peut éviter une perte de 80 000 à 150 000€. L'aménagement Patrick (4 500€) est urgent mais peut attendre 5 jours ouvrés. La matrice Urgence × Impact × Faisabilité favorise les actions à ROI maximal et coût minimal."
Feedback autre : "Le raisonnement ROI est clé. Avec 5 000€ : répondre à Amandine = 2h de temps RH (< 100€) et évite 10 000 à 43 000€ de contentieux. L'entretien Julie = 0€ et protège un CA de 1 134 000€. L'aménagement Patrick = 4 500€ urgent mais pas critique à J+1."

**Q10 — QCM RÉCAP 4 options**
"En analysant les 4 écarts budgétaires de COSMÉTICA™ (+147k€ MS, -23k€ formation, +26k€ recrutement, +48k€ intérim), quelle cause racine unique explique le mieux l'enchaînement de ces dérives ?"
- A) Une conjoncture économique défavorable dans le secteur cosmétique en 2023
- B) Un effectif RH insuffisant pour piloter 65 salariés
- C) **Un management commercial défaillant générant une cascade de coûts en chaîne ← CORRECT**
- D) Une politique salariale globalement non compétitive sur le marché
Feedback C : "Exact ! La chaîne causale : management Durand → 4 démissions commerciales → recrutements urgents (+26k€) → RH débordée → formations non planifiées (-23k€) → intérim non anticipé (+48k€) → dépassement MS global (+147k€). En parallèle : TMS non traités (Patrick + Corinne) → absences récurrentes → intérim supplémentaire. La cause racine est managériale et RPS, pas salariale ni conjoncturelle."
Feedback autre : "Analysez la chaîne causale : les 4 écarts se nourrissent mutuellement. Le management commercial génère les départs → les départs génèrent les recrutements urgents et l'intérim → la RH débordée ne planifie pas les formations → tout cela alourdit la MS. Une seule action en amont (management) aurait prévenu l'essentiel des dérapages."

---

## 7. STRUCTURE DES 3 SÉANCES (navigation)

Chaque séance suit le parcours : **Email → QCM multi-questions → Mission collective → Réflexion individuelle (4 questions)**

Conserver les missions et questions de réflexion du fichier original. Le contenu pédagogique est bon, ne pas le modifier.

**Modification du système QCM :** Passer d'1 question unique à 3-4 questions avec score affiché. Déverrouillage mission = répondu à toutes les questions (score indicatif, pas éliminatoire).

**Afficher le score** ("2/3 correctes — Bien ! La mission est déverrouillée.") puis bouton "Accéder à la mission →"

---

## 8. IMPÉRATIFS TECHNIQUES

- Fichier HTML **unique et complet** — tout inline (CSS dans `<style>`, JS dans `<script>`)
- **Aucun backend** — localStorage uniquement pour sauvegarder progression par utilisateur
- **Aucune librairie externe** sauf Google Fonts (CDN)
- Compatibilité Chrome, Safari, Firefox (pas d'API expérimentales)
- **localStorage :** clé `cosmetica_v5`, objet `{ user: string, students: { [name]: { ms, lv, refl, done } } }`
- Séances verrouillées si séance précédente non complétée
- Modal dossiers avec overlay et fermeture click extérieur / touche Escape
- Toast notifications : vert (ok), orange (alerte), rouge (erreur)
- Boîte mail : badge counter mis à jour en temps réel (localStorage pour mails lus)
- Animation `fadeInUp` sur changement de vue principale
- `tabindex` et raccourcis clavier basiques pour accessibilité

---

## 9. CE QU'IL NE FAUT PAS FAIRE

- ❌ Ne JAMAIS inscrire de taux calculés dans les données (absentéisme, turnover, ratio MS/CA) — seulement les données brutes
- ❌ Ne pas surcharger les dossiers salariés de texte — aller à l'essentiel (données utiles aux calculs uniquement)
- ❌ Ne pas rendre les QCM trop évidents — les pièges doivent être subtils et pédagogiques
- ❌ Pas de backend, pas de base de données, pas de frameworks JS
- ❌ Ne pas répéter les mêmes étiquettes ("risque critique") sans les définir
- ❌ Ne pas donner les résultats dans les "données de contexte" des questions de réflexion

---

Génère le fichier HTML complet en une seule fois. Le fichier doit être fonctionnel à l'ouverture dans un navigateur sans aucune installation ni connexion internet (sauf Google Fonts).
