/** Donnees PMO OMNIACOM extraites des fichiers Excel de suivi. */

export const BONS_COMMANDE = [
  { numeroBc: "BC-2401917", montantPo: 265679500, projetAssocie: "DRSC_Deploiement 2025_Construction des sites" },
  { numeroBc: "BC-2500254", montantPo: 217000000, projetAssocie: "DRSC_SITES REGULATEURS_ Construction des sites" },
  { numeroBc: "BC-2500911", montantPo: 185000000, projetAssocie: "DRSC_Projet New Sites 2025 Densification 94" },
  { numeroBc: "BC-2501410", montantPo: 40000000, projetAssocie: "DRSC_Projet complementaire" },
  { numeroBc: "BC-2501406", montantPo: 221000000, projetAssocie: "DRSC_Extension" },
  { numeroBc: "BC-2600865", montantPo: 67200000, projetAssocie: "DRSC_2026" },
];

export const CHANTIERS = [
  { codeSite: "EST_193", nomSite: "BERTOUA-Crf-ENIET", typeSite: "Greenfield", status: "DONE", comment: "Done", hauteurTour: "GF36", fournisseurTour: "CAMUSAT", prixSite: 18893500, numeroBc: "BC-2401917", projet: "DRSC_Deploiement 2025_Construction des sites" },
  { codeSite: "EST_194", nomSite: "Bertoua-Birpondo-II", typeSite: "Greenfield", status: "DONE", comment: "Done", hauteurTour: "GF36", fournisseurTour: "CAMUSAT", prixSite: 18893500, numeroBc: "BC-2401917", projet: "DRSC_Deploiement 2025_Construction des sites" },
  { codeSite: "CTR_953", nomSite: "AKKAK", typeSite: "Rooftop", status: "DONE", comment: "Done", hauteurTour: "15", fournisseurTour: "CAMUSAT", prixSite: 7800000, numeroBc: "BC-2401917", projet: "DRSC_Deploiement 2025_Construction des sites" },
  { codeSite: "CTR_859", nomSite: "NSEM", typeSite: "Greenfield", status: "DONE", comment: "Done", hauteurTour: "GF72", fournisseurTour: "CAMUSAT", prixSite: 31000000, numeroBc: "BC-2500254", projet: "DRSC_SITES REGULATEURS_ Construction des sites" },
  { codeSite: "CTR_1098", nomSite: "Mont-Belinga-Bell-Air", typeSite: "Rooftop", status: "DONE", comment: "Done", hauteurTour: "15", fournisseurTour: "I-ENGINEERING", prixSite: 8000000, numeroBc: "BC-2500911", projet: "DRSC_Projet New Sites 2025 Densification 94" },
  { codeSite: "CTR1113", nomSite: "GF 72M MBANGA BOULOU", typeSite: "GF 72M", status: "NEED_CLEAN_SITE", comment: "site cleaning on going", hauteurTour: "GF72", fournisseurTour: "CAMUSAT", prixSite: 31000000, numeroBc: "BC-2500254", projet: "DRSC_SITES REGULATEURS_ Construction des sites" },
  { codeSite: "SUD 181", nomSite: "EMANOVAM2", typeSite: "GF 72M", status: "ON_GOING", comment: "Excavation on going", hauteurTour: "GF72", fournisseurTour: "CAMUSAT", prixSite: 31000000, numeroBc: "BC-2500254", projet: "DRSC_SITES REGULATEURS_ Construction des sites" },
  { codeSite: "EXN_913_T", nomSite: "Maroua-Doualare-Cge-Adventiste", typeSite: "GF 36M", status: "ON_GOING", comment: "on going Tower on site", hauteurTour: "GF36", fournisseurTour: "I-ENGINEERING", prixSite: 18893500, numeroBc: "BC-2401917", projet: "DRSC_Deploiement 2025_Construction des sites" },
  { codeSite: "LIT_404", nomSite: "NR-Cite-New", typeSite: "RT 15M", status: "LANDLORD_ISSUE", comment: "Landor issue", hauteurTour: "15", fournisseurTour: "I-ENGINEERING", prixSite: 8000000, numeroBc: "BC-2500911", projet: "DRSC_Projet New Sites 2025 Densification 94" },
  { codeSite: "CTR_860", nomSite: "NYAKOKOMBO", typeSite: "GF72", status: "ON_GOING", comment: "on going Tower on site", hauteurTour: "GF72", fournisseurTour: "CAMUSAT", prixSite: 31000000, numeroBc: "BC-2401917", projet: "DRSC_SITES REGULATEURS_ Construction des sites" },
];

/** Lignes de facturation par numero BC (extrait Suivi Paiement OCM). */
export const LIGNES_PAR_BC = {
  "BC-2401917": [
    { montantHt: 53135900, statutPaiement: "PAID" },
    { montantHt: 39851925, statutPaiement: "PAID" },
    { montantHt: 26567950, statutPaiement: "PAID" },
  ],
  "BC-2500254": [
    { montantHt: 21700000, statutPaiement: "PAID" },
    { montantHt: 54250000, statutPaiement: "PAID" },
    { montantHt: 10850000, statutPaiement: "PAID" },
  ],
  "BC-2500911": [
    { montantHt: 9250000, statutPaiement: "PAID" },
    { montantHt: 55500000, statutPaiement: "PAID" },
    { montantHt: 27750000, statutPaiement: "PAID" },
  ],
  "BC-2501410": [
    { montantHt: 2000000, statutPaiement: "PAID" },
    { montantHt: 10000000, statutPaiement: "PAID" },
    { montantHt: 3920000, statutPaiement: "NOT_PAID" },
  ],
};
