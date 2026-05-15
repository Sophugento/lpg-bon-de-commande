export interface ProductInfo {
  description: string;
  descriptionDe: string;
  benefits: string[];
  benefitsDe: string[];
  imageUrl?: string;
  lpgUrl?: string;
}

const BASE = "https://www.lpg-group.com/media/wysiwyg/";
const BASE_URL = "https://www.lpg-group.com/fr/expertise-esthetique/cosmetiques/";

export const PRODUCT_INFO: Record<string, ProductInfo> = {
  "GEL LIPORÉDUCTEUR": {
    description: "Reshape et sculpte la silhouette pour des contours affinés.",
    descriptionDe: "Formt und modelliert die Silhouette für schlankere Konturen.",
    benefits: ["Resculpte les contours du corps", "Action minceur ciblée", "Sublime la silhouette"],
    benefitsDe: ["Modelliert die Körperkonturen", "Gezielt schlankende Wirkung", "Betont die Silhouette"],
    imageUrl: BASE + "GEL_LIPO-REDUCTEUR.jpg",
    lpgUrl: BASE_URL + "cosmetiques-corps/gel-liporeducteur",
  },
  "CRÈME LIPORÉDUCTEUR": {
    description: "Reshape et sculpte la silhouette pour des contours affinés.",
    descriptionDe: "Formt und modelliert die Silhouette für schlankere Konturen.",
    benefits: ["Resculpte les contours du corps", "Formule minceur longue durée", "Complète les soins professionnels"],
    benefitsDe: ["Modelliert die Körperkonturen", "Langanhaltende Schlankformel", "Ergänzt professionelle Behandlungen"],
    imageUrl: BASE + "CREME_LIPO-REDUCTRICE.jpg",
    lpgUrl: BASE_URL + "cosmetiques-corps/creme-liporeductrice",
  },
  "GEL-CRÈME ANTI CELLULITE": {
    description: "Traitement ciblé et intensif s'attaquant à tous les facteurs de la cellulite.",
    descriptionDe: "Gezielte und intensive Behandlung gegen alle Arten von Cellulite.",
    benefits: ["Cible tous les types de cellulite", "Action intensive et durable", "Approche multi-facteurs"],
    benefitsDe: ["Wirkt gegen alle Cellulite-Arten", "Intensive und langanhaltende Wirkung", "Multifaktor-Ansatz"],
    imageUrl: BASE + "GEL_CREME_ANTI_CELLULITE_8.jpg",
    lpgUrl: BASE_URL + "cosmetiques-corps/gel-creme-anti-cellulite",
  },
  "SÉRUM INTENSIF ANTI-CELLULITE": {
    description: "Action intensive contre la cellulite tenace pour une peau lissée et raffermie.",
    descriptionDe: "Intensive Wirkung gegen hartnäckige Cellulite für glattere, straffere Haut.",
    benefits: ["Cible la cellulite résistante", "Formule hautement concentrée", "Optimise les résultats endermologie"],
    benefitsDe: ["Wirkt gegen resistente Cellulite", "Hochkonzentrierte Formel", "Optimiert Endermologie-Ergebnisse"],
    imageUrl: BASE + "SERUM_INTENSIF_ANTI_CELLULITE_10.jpg",
    lpgUrl: BASE_URL + "cosmetiques-corps/serum-intensif-anti-cellulite",
  },
  "CRÈME MICRO PEELING": {
    description: "Préparateur de soin corps pour une peau revitalisée et hydratée.",
    descriptionDe: "Körperpflegevorbereiter für revitalisierte und hydratisierte Haut.",
    benefits: ["Prépare la peau aux soins", "Exfolie et hydrate en profondeur", "Lisse le grain de peau"],
    benefitsDe: ["Bereitet die Haut auf Behandlungen vor", "Exfoliiert und hydratisiert tief", "Glättet die Hautstruktur"],
    imageUrl: BASE + "CREME_MICRO_PEELING.jpg",
    lpgUrl: BASE_URL + "cosmetiques-corps/creme-micro-peeling",
  },
  "CRÈME FERMETÉ GALBANTE": {
    description: "Redonne fermeté et tonicité à la peau du corps.",
    descriptionDe: "Verleiht der Körperhaut wieder Festigkeit und Tonus.",
    benefits: ["Augmente la fermeté cutanée", "Améliore la tonicité", "Action raffermissante visible"],
    benefitsDe: ["Erhöht die Hautfestigkeit", "Verbessert den Hauttonus", "Sichtbar straffende Wirkung"],
    imageUrl: BASE + "Creme-fermete-galbante.jpg",
    lpgUrl: BASE_URL + "cosmetiques-corps/creme-fermete-galbante",
  },
  "HUILE EXPERTE VERGETURES": {
    description: "Huile naturelle riche en oméga 3, 6, 9 pour prévenir et corriger les vergetures.",
    descriptionDe: "Natürliches Öl reich an Omega 3, 6, 9 zur Vorbeugung und Korrektur von Dehnungsstreifen.",
    benefits: ["100% ingrédients naturels", "Prévient et corrige les vergetures", "Sûre pendant la grossesse"],
    benefitsDe: ["100% natürliche Inhaltsstoffe", "Beugt Dehnungsstreifen vor & korrigiert", "Sicher in der Schwangerschaft"],
    imageUrl: BASE + "Huile_Experte_Vergeture-LPG_3.jpg",
    lpgUrl: BASE_URL + "cosmetiques-corps/huile-experte-vergetures",
  },
  "BAUME DÉMAQUILLANT": {
    description: "Baume fondant qui démaquille en douceur tout en nourrissant la peau.",
    descriptionDe: "Schmelzender Balsam, der sanft reinigt und die Haut nährt.",
    benefits: ["Démaquillage doux et efficace", "Nourrit et apaise la peau", "Convient aux peaux sensibles"],
    benefitsDe: ["Sanfte und effektive Reinigung", "Nährt und beruhigt die Haut", "Für empfindliche Haut geeignet"],
    lpgUrl: BASE_URL + "cosmetiques-visage/nettoyer-preparer/baume-demaquillant",
  },
  "EAU MICELLAIRE PRÉPARATRICE": {
    description: "Eau micellaire préparatrice qui purifie et prépare la peau avant le soin.",
    descriptionDe: "Vorbereitendes Mizellenwasser, das die Haut reinigt und vor der Pflege vorbereitet.",
    benefits: ["Purifie sans agresser", "Prépare la peau aux soins", "Formule douce et efficace"],
    benefitsDe: ["Reinigt ohne zu reizen", "Bereitet die Haut auf Pflege vor", "Sanfte und wirksame Formel"],
    lpgUrl: BASE_URL + "cosmetiques-visage/nettoyer-preparer",
  },
  "SOIN NUIT RÉGÉNÉRANT SUBLIMATEUR": {
    description: "Soin de nuit qui régénère et sublime la peau pendant le sommeil.",
    descriptionDe: "Nachtpflege, die die Haut während des Schlafs regeneriert und verschönert.",
    benefits: ["Régénération cellulaire nocturne", "Teint lumineux au réveil", "Peau lissée et unifiée"],
    benefitsDe: ["Nächtliche Zellregeneration", "Strahlender Teint beim Aufwachen", "Geglättete und ebenmäßige Haut"],
    lpgUrl: BASE_URL + "cosmetiques-visage/cremes-jour-nuit",
  },
  "SOIN NUIT GLYCOLIQUE RESURFAÇANT": {
    description: "Estompe les taches, illumine le teint et lisse la peau grâce à l'acide glycolique.",
    descriptionDe: "Mildert Flecken, verschönert den Teint und glättet die Haut dank Glykolsäure.",
    benefits: ["Estompe les taches brunes", "Teint lumineux et unifié", "Peau visiblement lissée"],
    benefitsDe: ["Mildert Pigmentflecken", "Strahlender und ebenmäßiger Teint", "Sichtbar geglättete Haut"],
    lpgUrl: BASE_URL + "cosmetiques-visage/cremes-jour-nuit",
  },
  "SÉRUM LIFT RAFFERMISSANT": {
    description: "Préserve l'éclat et le maintien de la peau pour un effet liftant visible.",
    descriptionDe: "Erhält den Glanz und die Festigkeit der Haut für einen sichtbaren Lifting-Effekt.",
    benefits: ["Effet lift immédiat", "Raffermit et redensifie", "Préserve l'éclat naturel"],
    benefitsDe: ["Sofortiger Lifting-Effekt", "Strafft und verdichtet", "Erhält den natürlichen Glanz"],
    lpgUrl: BASE_URL + "cosmetiques-visage/serums",
  },
  "SÉRUM ANTI-ÂGE RÉGÉNÉRATION CELLULAIRE": {
    description: "Corrige tous les signes de l'âge grâce à la régénération cellulaire.",
    descriptionDe: "Korrigiert alle Anzeichen des Alterns durch Zellregeneration.",
    benefits: ["Régénération cellulaire profonde", "Corrige rides et taches", "Anti-âge global"],
    benefitsDe: ["Tiefe Zellregeneration", "Korrigiert Falten und Flecken", "Globale Anti-Aging-Wirkung"],
    lpgUrl: BASE_URL + "cosmetiques-visage/serums",
  },
  "FLUIDE UV+ DÉFENSE CELLULAIRE": {
    description: "Protection solaire très haute contre UVA/UVB et lumière bleue.",
    descriptionDe: "Sehr hoher Sonnenschutz gegen UVA/UVB und blaues Licht.",
    benefits: ["SPF50+ UVA/UVB", "Protection lumière bleue", "Texture légère non grasse"],
    benefitsDe: ["LSF50+ UVA/UVB", "Schutz vor blauem Licht", "Leichte, nicht fettige Textur"],
    lpgUrl: BASE_URL + "cosmetiques-visage/protection-solaire",
  },
};
