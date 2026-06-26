/** Retourne true si le type de site est un rooftop. */
export function isRooftop(typeSite) {
  if (!typeSite) return false;
  const t = typeSite.toLowerCase();
  return t.includes("rooftop") || t.includes("rt ");
}

/** Calcule le retard en jours (positif = en retard). */
export function calcRetardJours(datePlanifiee, dateReelle) {
  if (!datePlanifiee || !dateReelle) return 0;
  const plan = new Date(datePlanifiee);
  const reel = new Date(dateReelle);
  plan.setHours(0, 0, 0, 0);
  reel.setHours(0, 0, 0, 0);
  return Math.round((reel - plan) / (1000 * 60 * 60 * 24));
}

/** Derive le statut d'une etape a partir des dates. */
export function deriveEtapeStatus(etape, now = new Date()) {
  if (etape.status === "NON_APPLICABLE") return "NON_APPLICABLE";
  if (etape.dateReelle) {
    const retard = calcRetardJours(etape.datePlanifiee, etape.dateReelle);
    return retard > 0 ? "EN_RETARD" : "TERMINE";
  }
  if (etape.datePlanifiee && new Date(etape.datePlanifiee) < now) return "EN_RETARD";
  if (etape.datePlanifiee) return "EN_COURS";
  return "EN_ATTENTE";
}

/** Calcule l'avancement reel (% etapes terminees). */
export function calcAvancementReel(etapes) {
  const applicables = etapes.filter((e) => e.status !== "NON_APPLICABLE");
  if (applicables.length === 0) return 0;
  const terminees = applicables.filter((e) => e.status === "TERMINE" || e.status === "EN_RETARD").length;
  return Math.round((terminees / applicables.length) * 100);
}

/** Mappe un commentaire Excel vers ChantierStatut. */
export function mapCommentToStatus(comment) {
  if (!comment) return "ON_GOING";
  const c = comment.toLowerCase();
  if (c.includes("done")) return "DONE";
  if (c.includes("landor") || c.includes("landlord")) return "LANDLORD_ISSUE";
  if (c.includes("clean")) return "NEED_CLEAN_SITE";
  if (c.includes("apd")) return "APD_ON_GOING";
  return "ON_GOING";
}
