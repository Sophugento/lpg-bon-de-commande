export type Lang = "fr" | "de";

export const TRANSLATIONS = {
  fr: {
    // Header
    title: "Bon de commande 2026",
    brand: "LPG Switzerland",

    // Règles
    rulesTitle: "Conditions de commande",
    ruleMin: "Minimum de commande :",
    ruleShipping: "Frais de port :",
    ruleShippingDetail: "— offerts dès 400 CHF netto",
    rulePromo: "Produits revente : 6 achetés = 1 offert · 10 = +2 offerts",
    ruleMinQty: "Min. 3 pièces du même produit (revente)",

    // Catégories
    Corps: "Corps",
    Visage: "Visage",
    Nutricosmetics: "Nutricosmetics",
    Cosmetotextiles: "Cosmétotextiles",
    Consommables: "Consommables",

    // Sections
    offresSpeciales: "Offres Spéciales",

    // Types produit
    revente: "Revente",
    cabine: "Cabine",
    recharge: "Recharge",

    // Sous-catégories
    subcategories: {
      "Réduction de volume": "Réduction de volume",
      "Cellulite": "Cellulite",
      "Anti-aging": "Anti-aging",
      "Bien-être": "Bien-être",
      "Nettoyer & Préparer": "Nettoyer & Préparer",
      "Sérum": "Sérum",
      "Crèmes Jour / Nuit": "Crèmes Jour / Nuit",
      "Yeux & Lèvres": "Yeux & Lèvres",
      "Régénérer": "Régénérer",
      "Mains": "Mains",
      "Nutricosmetics": "Nutricosmetics",
      "Cosmetotextiles": "Cosmétotextiles",
      "Consommables": "Consommables",
    } as Record<string, string>,

    // Prix
    htNote: "Tous les prix sont netto (HT)",
    prixVente: "Prix vente :",

    // Promo
    promoLabel: (n: number, code: string) => `🎁 +${n} offert${n > 1 ? "s" : ""} (${code})`,
    minQtyWarning: "Min. 3 pièces requis",

    // Barre commande
    sousTotal: "Sous-total",
    port: "Port",
    portOffert: "Offert ✓",
    portOffertDes: "Port offert dès 400,00 CHF",
    total: "Total",
    btnStart: "Commencer la sélection",
    btnMinNotReached: (missing: string) => `Minimum non atteint (encore ${missing})`,
    btnSend: "Envoyer la commande →",

    // Modal
    modalTitle: "Finaliser la commande",
    coordTitle: "Vos coordonnées",
    firstName: "Prénom *",
    lastName: "Nom *",
    company: "Nom société",
    address: "Adresse *",
    postalCode: "NPA *",
    city: "Ville *",
    email: "E-mail *",
    phone: "Téléphone",
    notes: "Remarques / Notes",
    deliveryQuestion: "L'adresse de livraison est-elle identique ?",
    deliveryYes: "Oui",
    deliveryNo: "Non — indiquer l'adresse de livraison",
    deliveryTitle: "Adresse de livraison",
    deliveryCompany: "Société / Nom",
    deliveryAddress: "Adresse *",
    deliveryPostalCode: "NPA *",
    deliveryCity: "Ville *",
    recap: "Récapitulatif",
    shippingLabel: "Frais de port",
    shippingFree: "Offerts",
    btnConfirm: "Confirmer la commande",
    btnSending: "Envoi en cours…",
    successTitle: "Commande envoyée !",
    successMsg:
      "Votre commande a été transmise à LPG Switzerland. Vous recevrez une confirmation par e-mail.",
    btnClose: "Fermer",
    errorPrefix: "Erreur : ",
  },

  de: {
    title: "Bestellformular 2026",
    brand: "LPG Switzerland",

    rulesTitle: "Bestellbedingungen",
    ruleMin: "Mindestbestellwert:",
    ruleShipping: "Portokosten:",
    ruleShippingDetail: "— ab 400 CHF netto portofrei",
    rulePromo: "Verkaufsprodukte: 6 gekauft = 1 geschenkt · 10 = +2 geschenkt",
    ruleMinQty: "Mind. 3 Stück desselben Produkts (Verkauf)",

    Corps: "Körper",
    Visage: "Gesicht",
    Nutricosmetics: "Nutricosmetics",
    Cosmetotextiles: "Kosmetotextilien",
    Consommables: "Material-Bedarf",

    offresSpeciales: "Sonderangebote",

    revente: "Verkauf",
    cabine: "Professionell",
    recharge: "Nachfüllung",

    subcategories: {
      "Réduction de volume": "Volumenreduzierung",
      "Cellulite": "Cellulite",
      "Anti-aging": "Anti-Aging",
      "Bien-être": "Wohlbefinden",
      "Nettoyer & Préparer": "Reinigen & Vorbereiten",
      "Sérum": "Serum",
      "Crèmes Jour / Nuit": "Tages- / Nachtcremes",
      "Yeux & Lèvres": "Augen & Lippen",
      "Régénérer": "Regenerieren",
      "Mains": "Hände",
      "Nutricosmetics": "Nutricosmetics",
      "Cosmetotextiles": "Kosmetotextilien",
      "Consommables": "Material-Bedarf",
    } as Record<string, string>,

    htNote: "Alle Preise sind Nettopreise (exkl. MwSt.)",
    prixVente: "Verkaufspreis:",

    promoLabel: (n: number, code: string) => `🎁 +${n} geschenkt (${code})`,
    minQtyWarning: "Mind. 3 Stück erforderlich",

    sousTotal: "Zwischensumme",
    port: "Porto",
    portOffert: "Gratis ✓",
    portOffertDes: "Portofrei ab 400,00 CHF",
    total: "Total",
    btnStart: "Auswahl beginnen",
    btnMinNotReached: (missing: string) => `Mindestbestellwert nicht erreicht (noch ${missing})`,
    btnSend: "Bestellung senden →",

    modalTitle: "Bestellung abschliessen",
    coordTitle: "Ihre Kontaktdaten",
    firstName: "Vorname *",
    lastName: "Nachname *",
    company: "Firmenname",
    address: "Adresse *",
    postalCode: "PLZ *",
    city: "Ort *",
    email: "E-Mail *",
    phone: "Telefon",
    notes: "Bemerkungen / Notizen",
    deliveryQuestion: "Ist die Lieferadresse identisch?",
    deliveryYes: "Ja",
    deliveryNo: "Nein — andere Lieferadresse angeben",
    deliveryTitle: "Lieferadresse",
    deliveryCompany: "Firma / Name",
    deliveryAddress: "Adresse *",
    deliveryPostalCode: "PLZ *",
    deliveryCity: "Ort *",
    recap: "Zusammenfassung",
    shippingLabel: "Porto",
    shippingFree: "Gratis",
    btnConfirm: "Bestellung bestätigen",
    btnSending: "Wird gesendet…",
    successTitle: "Bestellung gesendet!",
    successMsg:
      "Ihre Bestellung wurde an LPG Switzerland übermittelt. Sie erhalten eine Bestätigung per E-Mail.",
    btnClose: "Schliessen",
    errorPrefix: "Fehler: ",
  },
} as const;

export type T = (typeof TRANSLATIONS)["fr"] | (typeof TRANSLATIONS)["de"];
