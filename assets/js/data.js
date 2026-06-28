'use strict';

// ---------------------------------------------------------------------------
// HISTORIQUE DU SMIC (brut mensuel, 35h)
// ---------------------------------------------------------------------------
const SMIC_HISTORY = [
  { from: '2022-01-01', to: '2022-04-30', monthly: 1603.12 },
  { from: '2022-05-01', to: '2022-07-31', monthly: 1645.58 },
  { from: '2022-08-01', to: '2022-12-31', monthly: 1678.95 },
  { from: '2023-01-01', to: '2023-04-30', monthly: 1709.28 },
  { from: '2023-05-01', to: '2023-12-31', monthly: 1747.20 },
  { from: '2024-01-01', to: '2024-10-31', monthly: 1766.92 },
  { from: '2024-11-01', to: '2025-05-31', monthly: 1801.80 },
  { from: '2025-06-01', to: '2025-10-31', monthly: 1812.96 },
  { from: '2025-11-01', to: '2025-12-31', monthly: 1812.96 }, // décret 2025-951 à vérifier
  { from: '2026-01-01', to: '2026-05-31', monthly: 1823.03 },
  { from: '2026-06-01', to: '2099-12-31', monthly: 1867.02 }, // Arrêté du 22 mai 2026
];

// ---------------------------------------------------------------------------
// GRILLE LÉGALE — Art. D6222-26 du Code du travail
// ---------------------------------------------------------------------------
const LEGAL_GRID = {
  'lt18':  { 1: 27, 2: 39, 3: 55 },
  '18-20': { 1: 43, 2: 51, 3: 67 },
  '21-25': { 1: 53, 2: 61, 3: 78 },
  'ge26':  { 1: 100, 2: 100, 3: 100 },
};

const BRACKET_LABELS = {
  'lt18':  'Moins de 18 ans',
  '18-20': '18 à 20 ans',
  '21-25': '21 à 25 ans',
  'ge26':  '26 ans et plus',
};

// ---------------------------------------------------------------------------
// DIPLÔMES / TITRES
// initialYear : année d'exécution de départ (1 = standard, 2 = LP/M2, 3 = L3)
// duration    : durée en années (null = saisie manuelle)
// ---------------------------------------------------------------------------
const DIPLOMES = [
  { id: 'cap',         label: 'CAP',                                    duration: 2, initialYear: 1 },
  { id: 'bep',         label: 'BEP',                                    duration: 2, initialYear: 1 },
  { id: 'bac-pro',     label: 'Bac Pro',                                duration: 3, initialYear: 1 },
  { id: 'bts',         label: 'BTS',                                    duration: 2, initialYear: 1 },
  { id: 'but',         label: 'BUT (Bachelor Univ. de Technologie)',     duration: 3, initialYear: 1 },
  { id: 'licence-l3',  label: 'Licence Générale — L3 seule',            duration: 1, initialYear: 3, ref: 'Art. D6222-28-1', note: 'Taux 3e année appliqué (intégration en cours de cycle)' },
  { id: 'licence-pro', label: 'Licence Professionnelle (1 an)',          duration: 1, initialYear: 2, ref: 'Art. D6222-32',   note: 'Taux 2e année appliqué' },
  { id: 'bachelor',    label: 'Bachelor (cycle 3 ans)',                  duration: 3, initialYear: 1 },
  { id: 'master-m1m2', label: 'Master complet M1+M2 (2 ans)',           duration: 2, initialYear: 1 },
  { id: 'master-m2',   label: 'Master 2 seul — M2 uniquement (1 an)',   duration: 1, initialYear: 2, ref: 'Art. D6222-28-1', note: 'Taux 2e année appliqué (intégration en cours de cycle)' },
  { id: 'mastere-mba', label: 'Mastère spécialisé / MBA (1 an)',        duration: 1, initialYear: 2, note: 'Taux 2e année par assimilation' },
  { id: 'titre-pro',   label: 'Titre professionnel (durée variable)',    duration: null, initialYear: 1, customDuration: true },
  { id: 'autre',       label: 'Autre diplôme ou qualification',          duration: null, initialYear: 1, customDuration: true },
];

// ---------------------------------------------------------------------------
// CONVENTIONS COLLECTIVES (IDCC + mots-clés)
// ---------------------------------------------------------------------------
const CONVENTIONS = [
  { idcc: '16',   name: 'Transports routiers et activités auxiliaires',          keywords: ['transport', 'camion', 'logistique', 'livraison', 'routier', 'transporteur'] },
  { idcc: '29',   name: 'Hospitalisation privée non lucratif (CCN51 — FEHAP)',   keywords: ['hôpital', 'clinique', 'santé', 'fehap', 'soins', 'hospitalisation', 'médico-social'] },
  { idcc: '44',   name: 'Industries chimiques',                                  keywords: ['chimie', 'laboratoire', 'chimique', 'industrie chimique'] },
  { idcc: '86',   name: 'Cabinets médicaux',                                     keywords: ['médecin', 'cabinet médical', 'secrétariat médical'] },
  { idcc: '176',  name: 'Industries textiles',                                   keywords: ['textile', 'confection', 'mode', 'tissu'] },
  { idcc: '275',  name: 'Industrie pharmaceutique',                              keywords: ['pharma', 'médicament', 'laboratoire pharmaceutique', 'pharmacie industrielle'] },
  { idcc: '292',  name: 'Plasturgie et composites',                              keywords: ['plastique', 'composite', 'plasturgie'] },
  { idcc: '405',  name: 'Menuiserie, charpente, construction bois',              keywords: ['menuiserie', 'bois', 'charpente', 'ébénisterie', 'parquet'] },
  { idcc: '414',  name: 'Industries laitières',                                  keywords: ['lait', 'fromagerie', 'agroalimentaire', 'laitier', 'fromage'] },
  { idcc: '468',  name: 'Sociétés d\'assurances',                                keywords: ['assurance', 'mutuelle', 'assureur'] },
  { idcc: '493',  name: 'Vins, cidres, spiritueux',                              keywords: ['vin', 'vigne', 'alcool', 'spiritueux', 'cave', 'vigneron'] },
  { idcc: '500',  name: 'Enseignement privé (CNEAP)',                            keywords: ['enseignement', 'école', 'formation', 'cneap', 'éducation'] },
  { idcc: '538',  name: 'Banques (AFB)',                                         keywords: ['banque', 'crédit', 'finance', 'bancaire', 'afb'] },
  { idcc: '700',  name: 'Banques populaires',                                    keywords: ['banque populaire', 'banque', 'finance'] },
  { idcc: '702',  name: 'Caisse d\'épargne',                                     keywords: ['caisse d\'épargne', 'épargne'] },
  { idcc: '787',  name: 'Bâtiment — ETAM et cadres',                            keywords: ['bâtiment', 'construction', 'btp', 'cadre', 'etam'] },
  { idcc: '843',  name: 'Commerce alimentaire — grandes surfaces',               keywords: ['supermarché', 'grande distribution', 'hypermarché'] },
  { idcc: '992',  name: 'Boucherie, charcuterie, traiteurs',                    keywords: ['boucher', 'charcutier', 'boucherie', 'charcuterie', 'traiteur'] },
  { idcc: '1043', name: 'Hôtels, cafés, restaurants (HCR)',                     keywords: ['hôtel', 'restaurant', 'café', 'chr', 'restauration', 'hcr', 'tourisme hôtellerie'] },
  { idcc: '1090', name: 'Services de l\'automobile',                             keywords: ['garage', 'auto', 'mécanique', 'carrosserie', 'concession', 'automobile'] },
  { idcc: '1147', name: 'Ambulances',                                            keywords: ['ambulance', 'transport sanitaire', 'ambulancier'] },
  { idcc: '1261', name: 'Animation socioculturelle',                             keywords: ['animation', 'centre social', 'associatif', 'animateur socioculturel'] },
  { idcc: '1266', name: 'Pharmacies d\'officine',                                keywords: ['pharmacie', 'préparateur', 'pharmacien', 'officine'] },
  { idcc: '1267', name: 'Commerce de détail non alimentaire',                    keywords: ['commerce', 'détail', 'magasin', 'boutique'] },
  { idcc: '1351', name: 'Restauration collective',                               keywords: ['cantine', 'restauration collective', 'sodexo', 'compass', 'elior'] },
  { idcc: '1404', name: 'Matériels agricoles et TP (SDLM)',                     keywords: ['agricole', 'matériel', 'tracteur', 'sdlm'] },
  { idcc: '1413', name: 'Travail temporaire',                                    keywords: ['intérim', 'travail temporaire', 'agence', 'intérimaire'] },
  { idcc: '1480', name: 'Journalistes professionnels',                           keywords: ['journaliste', 'presse', 'rédaction', 'médias'] },
  { idcc: '1483', name: 'Commerce de détail de l\'habillement',                  keywords: ['habillement', 'vêtement', 'mode', 'prêt-à-porter'] },
  { idcc: '1486', name: 'Syntec (bureaux d\'études, ESN, numérique)',            keywords: ['informatique', 'esn', 'bureau d\'études', 'ingénieur', 'conseil', 'ssii', 'syntec', 'numérique', 'it', 'développeur', 'digital'] },
  { idcc: '1501', name: 'Restauration rapide',                                   keywords: ['fast food', 'burger', 'sandwicherie', 'pizza', 'restauration rapide'] },
  { idcc: '1505', name: 'Grande distribution alimentaire',                       keywords: ['leclerc', 'intermarché', 'système u', 'casino', 'grande distribution alimentaire'] },
  { idcc: '1516', name: 'Esthétique cosmétique',                                 keywords: ['esthétique', 'beauté', 'cosmétique', 'spa', 'institut'] },
  { idcc: '1518', name: 'Animation (ECLAT)',                                     keywords: ['animateur', 'bpjeps', 'éducation populaire', 'eclat', 'centre loisirs'] },
  { idcc: '1527', name: 'Immobilier — agents immobiliers',                       keywords: ['immobilier', 'agent immobilier', 'transaction', 'fnaim', 'syndic'] },
  { idcc: '1534', name: 'Industrie de la viande',                                keywords: ['abattoir', 'viande', 'découpe', 'industrie viande'] },
  { idcc: '1536', name: 'Notariat',                                              keywords: ['notaire', 'étude notariale', 'clerc', 'notarial'] },
  { idcc: '1539', name: 'Aide à domicile (associations — ADMR)',                 keywords: ['aide à domicile', 'admr', 'saad', 'aide soignant à domicile'] },
  { idcc: '1555', name: 'Gardiens, concierges d\'immeubles',                     keywords: ['gardien', 'concierge', 'immeuble', 'loge'] },
  { idcc: '1596', name: 'Bâtiment — ouvriers (≤ 10 salariés)',                  keywords: ['artisan', 'bâtiment', 'maçon', 'plombier', 'électricien'] },
  { idcc: '1597', name: 'Bâtiment — ouvriers (> 10 salariés)',                  keywords: ['bâtiment', 'construction', 'maçonnerie', 'btp ouvriers'] },
  { idcc: '1672', name: 'Sociétés financières',                                  keywords: ['finance', 'banque', 'crédit', 'leasing', 'financier'] },
  { idcc: '1702', name: 'Négoce de bois',                                        keywords: ['bois', 'négoce', 'scierie'] },
  { idcc: '1710', name: 'Agences de voyages',                                    keywords: ['voyage', 'tourisme', 'agence de voyage', 'billetterie'] },
  { idcc: '1740', name: 'Bâtiment — Île-de-France',                             keywords: ['bâtiment', 'idf', 'paris', 'construction ile-de-france'] },
  { idcc: '1747', name: 'Bureaux d\'études techniques (CINOV)',                  keywords: ['bureau d\'études', 'ingénierie', 'géomètre', 'cinov', 'bet'] },
  { idcc: '1752', name: 'Hôtellerie de plein air (camping)',                     keywords: ['camping', 'plein air', 'mobil-home', 'hpa', 'parc résidentiel'] },
  { idcc: '1775', name: 'Particuliers employeurs (FEPEM)',                       keywords: ['particulier employeur', 'garde d\'enfants', 'femme de ménage', 'fepem'] },
  { idcc: '1790', name: 'Entreprises de propreté et services associés',          keywords: ['nettoyage', 'propreté', 'entretien', 'agent de nettoyage', 'ménage'] },
  { idcc: '1801', name: 'Associations culturelles',                              keywords: ['culture', 'association', 'théâtre', 'musée', 'culturel'] },
  { idcc: '1821', name: 'Logement social (bailleurs HLM)',                       keywords: ['hlm', 'logement social', 'bailleur', 'oph'] },
  { idcc: '1979', name: 'Hôtels cafés restaurants (ancienne CCN)',               keywords: ['hôtel', 'café', 'restaurant', 'ancienne hcr'] },
  { idcc: '2002', name: 'Blanchisserie, pressing',                               keywords: ['pressing', 'blanchisserie', 'laverie', 'teinturerie'] },
  { idcc: '2098', name: 'Services aux entreprises — centres d\'appels',          keywords: ['centre d\'appels', 'télémarketing', 'bpo', 'call center'] },
  { idcc: '2120', name: 'Coiffure',                                              keywords: ['coiffure', 'salon de coiffure', 'coiffeur', 'barbier'] },
  { idcc: '2128', name: 'Audiovisuel, production',                               keywords: ['audiovisuel', 'production', 'télévision', 'cinéma', 'film'] },
  { idcc: '2148', name: 'Personnel navigant de l\'aviation civile',              keywords: ['pilote', 'hôtesse', 'steward', 'aviation', 'navigant'] },
  { idcc: '2216', name: 'Grande distribution spécialisée (bricolage, sport…)',   keywords: ['bricolage', 'leroy merlin', 'castorama', 'décathlon', 'sport', 'maison'] },
  { idcc: '2344', name: 'Aide, accompagnement, soins à domicile',               keywords: ['aide soignant', 'saad', 'ssiad', 'accompagnement domicile', 'soins domicile'] },
  { idcc: '2408', name: 'Fleuristes, art floral',                                keywords: ['fleuriste', 'fleurs', 'plantes', 'floral'] },
  { idcc: '2410', name: 'Biscotteries, chocolateries, confiseries',              keywords: ['chocolat', 'confiserie', 'biscuit', 'chocolaterie'] },
  { idcc: '3043', name: 'Entreprises de propreté (nouvelle convention)',         keywords: ['propreté', 'nettoyage', 'entretien', 'facility management'] },
  { idcc: '3127', name: 'Services à la personne (prestataires commerciaux)',     keywords: ['sap', 'service à la personne', 'maintien à domicile', 'aide senior'] },
  { idcc: '3248', name: 'Métallurgie (convention unifiée 2024)',                 keywords: ['métal', 'métallurgie', 'industrie', 'usinage', 'soudure', 'forge', 'mécanique industrielle'] },
  { idcc: '3251', name: 'Bijouterie, joaillerie, orfèvrerie, horlogerie',        keywords: ['bijou', 'joaillerie', 'orfèvre', 'horlogerie', 'bijoutier'] },
];
