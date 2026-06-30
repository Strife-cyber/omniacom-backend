import { PrismaClient } from "../src/generated/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
import { BONS_COMMANDE, CHANTIERS, LIGNES_PAR_BC } from "./data/omniacom-seed.js";
import { ETAPES_MODELE } from "../src/constants/etapes-modele.js";

config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// ===========================================================================
// UTILITAIRES
// ===========================================================================

function dateDepart(joursEnArriere) {
  const d = new Date();
  d.setDate(d.getDate() - joursEnArriere);
  d.setHours(8, 0, 0, 0);
  return d;
}

function dateDansFutur(joursEnAvant) {
  const d = new Date();
  d.setDate(d.getDate() + joursEnAvant);
  d.setHours(8, 0, 0, 0);
  return d;
}

function addHours(date, heures) {
  const d = new Date(date);
  d.setHours(d.getHours() + heures);
  return d;
}

const SALT_ROUNDS = 12;

async function hashMdp(mdp) {
  return bcrypt.hash(mdp, SALT_ROUNDS);
}

// ===========================================================================
// 1. UTILISATEURS
// ===========================================================================

async function seedUtilisateurs() {
  console.log("  Utilisateurs...");

  const utilisateurs = [
    {
      email: "admin@omniacom.fr",
      nom: "Admin Systeme",
      motDePasse: await hashMdp("admin123"),
      role: "ADMIN",
    },
    {
      email: "pmo@omniacom.fr",
      nom: "Chef de Projet",
      motDePasse: await hashMdp("pmo123"),
      role: "PMO",
    },
    {
      email: "planning@omniacom.fr",
      nom: "Gestionnaire Planning",
      motDePasse: await hashMdp("planning123"),
      role: "GESTIONNAIRE_PLANNING",
    },
    {
      email: "epi@omniacom.fr",
      nom: "Gestionnaire EPI",
      motDePasse: await hashMdp("epi123"),
      role: "GESTIONNAIRE_EPI",
    },
    {
      email: "tech@omniacom.fr",
      nom: "Technicien User",
      motDePasse: await hashMdp("tech123"),
      role: "UTILISATEUR",
    },
  ];

  for (const u of utilisateurs) {
    await prisma.utilisateur.upsert({
      where: { email: u.email },
      update: { nom: u.nom, role: u.role },
      create: u,
    });
  }

  console.log(`    ${utilisateurs.length} utilisateurs crees`);
}

// ===========================================================================
// 2. TECHNICIENS
// ===========================================================================

async function seedTechniciens() {
  console.log("  Techniciens...");

  const techniciens = [
    {
      nom: "Martin",
      prenom: "Lucas",
      telephone: "0612345678",
      status: "ACTIF",
    },
    {
      nom: "Bernard",
      prenom: "Thomas",
      telephone: "0623456789",
      status: "ACTIF",
    },
    { nom: "Dubois", prenom: "Emma", telephone: "0634567890", status: "ACTIF" },
    { nom: "Petit", prenom: "Lena", telephone: "0645678901", status: "ACTIF" },
    {
      nom: "Moreau",
      prenom: "Hugo",
      telephone: "0656789012",
      status: "INACTIF",
    },
  ];

  for (const t of techniciens) {
    await prisma.technicien.create({ data: t });
  }

  console.log(`    ${techniciens.length} techniciens crees`);
}

// ===========================================================================
// 3. SITES
// ===========================================================================

async function seedSites() {
  console.log("  Sites...");

  const sites = [
    {
      nom: "Siege Social - Paris 17",
      localisation: "125 Boulevard Haussmann, 75008 Paris",
      region: "Ile-de-France",
    },
    {
      nom: "Agence Lyon Part-Dieu",
      localisation: "3 Rue du Lac, 69003 Lyon",
      region: "Auvergne-Rhone-Alpes",
    },
    {
      nom: "Agence Marseille Vieux-Port",
      localisation: "12 Quai du Port, 13002 Marseille",
      region: "Provence-Alpes-Cote d'Azur",
    },
    {
      nom: "Agence Bordeaux",
      localisation: "45 Rue Sainte-Catherine, 33000 Bordeaux",
      region: "Nouvelle-Aquitaine",
    },
    {
      nom: "Agence Lille",
      localisation: "78 Rue de Bethune, 59000 Lille",
      region: "Hauts-de-France",
    },
    {
      nom: "Agence Toulouse",
      localisation: "22 Rue d'Alsace-Lorraine, 31000 Toulouse",
      region: "Occitanie",
    },
  ];

  for (const s of sites) {
    await prisma.site.create({ data: s });
  }

  console.log(`    ${sites.length} sites crees`);
}

// ===========================================================================
// 5. CHANTIERS
// ===========================================================================

async function seedChantiers() {
  console.log("  Chantiers OMNIACOM...");
  const bcMap = {};
  const bons = await prisma.bonDeCommande.findMany();
  for (const b of bons) bcMap[b.numeroBc] = b.id;

  for (const modele of ETAPES_MODELE) {
    await prisma.etapeModele.upsert({
      where: { code: modele.code },
      update: modele,
      create: modele,
    });
  }

  for (const c of CHANTIERS) {
    const rooftop = c.typeSite.toLowerCase().includes("rooftop") || c.typeSite.toLowerCase().includes("rt ");
    const chantier = await prisma.chantier.create({
      data: {
        entreprise: "OMNIACOM",
        codeSite: c.codeSite,
        nomSite: c.nomSite,
        typeSite: c.typeSite,
        status: c.status,
        comment: c.comment,
        projet: c.projet,
        hauteurTour: c.hauteurTour,
        fournisseurTour: c.fournisseurTour,
        prixSite: c.prixSite,
        bonDeCommandeId: bcMap[c.numeroBc] ?? null,
        dateGo: dateDepart(90),
        avancementPlanifie: c.status === "DONE" ? 100 : 50,
        avancementReel: c.status === "DONE" ? 100 : 30,
      },
    });
    await prisma.etapeChantier.createMany({
      data: ETAPES_MODELE.map((m) => ({
        chantierId: chantier.id,
        codeEtape: m.code,
        nomEtape: m.libelle,
        ordre: m.ordre,
        status: rooftop && !m.actifPourRooftop ? "NON_APPLICABLE" : c.status === "DONE" ? "TERMINE" : "EN_ATTENTE",
        datePlanifiee: dateDepart(60 - m.ordre),
        dateReelle: c.status === "DONE" ? dateDepart(58 - m.ordre) : null,
        retardJours: 0,
      })),
    });
  }
  console.log(`    ${CHANTIERS.length} chantiers OMNIACOM crees`);
}

// ===========================================================================
// 6. INTERVENTIONS
// ===========================================================================

async function seedInterventions() {
  console.log("  Interventions...");

  const techniciens = await prisma.technicien.findMany({ take: 4 });
  const sites = await prisma.site.findMany({ take: 4 });

  const maintenant = new Date();

  function i(site, technicien, debut, fin, type, statut) {
    return {
      site: { connect: { id: site.id } },
      technicien: { connect: { id: technicien.id } },
      timestampDebut: debut,
      timestampFin: fin,
      typeAction: type,
      statut,
    };
  }

  const interventions = [
    i(
      sites[0],
      techniciens[0],
      dateDepart(10),
      addHours(dateDepart(10), 4),
      "MAINTENANCE",
      "TERMINE",
    ),
    i(
      sites[0],
      techniciens[1],
      dateDepart(5),
      addHours(dateDepart(5), 3),
      "DEPANNAGE",
      "TERMINE",
    ),
    i(
      sites[1],
      techniciens[0],
      dateDepart(2),
      addHours(dateDepart(2), 6),
      "INSTALLATION",
      "TERMINE",
    ),
    i(
      sites[1],
      techniciens[2],
      dateDepart(1),
      addHours(dateDepart(1), 2),
      "MAINTENANCE",
      "TERMINE",
    ),
    i(
      sites[2],
      techniciens[1],
      dateDepart(0),
      addHours(dateDepart(0), 3),
      "AUDIT",
      "EN_COURS",
    ),
    i(
      sites[2],
      techniciens[3],
      dateDansFutur(1),
      addHours(dateDansFutur(1), 5),
      "DEPANNAGE",
      "PLANIFIE",
    ),
    i(
      sites[3],
      techniciens[0],
      dateDansFutur(3),
      addHours(dateDansFutur(3), 4),
      "INSTALLATION",
      "PLANIFIE",
    ),
    i(
      sites[0],
      techniciens[2],
      dateDepart(7),
      addHours(dateDepart(7), 5),
      "MAINTENANCE",
      "TERMINE",
    ),
  ];

  for (const i of interventions) {
    await prisma.intervention.create({ data: i });
  }

  console.log(`    ${interventions.length} interventions crees`);
}

// ===========================================================================
// 7. VERIFICATIONS EPI
// ===========================================================================

async function seedVerificationsEPI() {
  console.log("  Verifications EPI...");

  const techniciens = await prisma.technicien.findMany({ take: 4 });

  const verifications = [
    {
      technicien: { connect: { id: techniciens[0].id } },
      dateDerniereVerif: dateDepart(90),
      dateDemande: dateDepart(95),
      dateEnvoie: dateDepart(92),
      joursRetard: 5,
      prochaineDate: dateDansFutur(275),
    },
    {
      technicien: { connect: { id: techniciens[1].id } },
      dateDerniereVerif: dateDepart(180),
      dateDemande: dateDepart(185),
      dateEnvoie: dateDepart(182),
      joursRetard: 0,
      prochaineDate: dateDansFutur(185),
    },
    {
      technicien: { connect: { id: techniciens[2].id } },
      dateDerniereVerif: dateDepart(45),
      dateDemande: dateDepart(50),
      dateEnvoie: dateDepart(48),
      joursRetard: 15,
      prochaineDate: dateDepart(-5),
    },
    {
      technicien: { connect: { id: techniciens[3].id } },
      dateDerniereVerif: dateDepart(200),
      dateDemande: dateDepart(205),
      dateEnvoie: dateDepart(202),
      joursRetard: 12,
      prochaineDate: dateDepart(-30),
    },
  ];

  for (const v of verifications) {
    await prisma.verificationEPI.create({ data: v });
  }

  console.log(`    ${verifications.length} verifications EPI crees`);
}

// ===========================================================================
// 8. PRESENCES
// ===========================================================================

async function seedPresences() {
  console.log("  Presences...");

  const interventions = await prisma.intervention.findMany({ take: 5 });
  const techniciens = await prisma.technicien.findMany({ take: 4 });

  const presences = [
    {
      technicien: { connect: { id: techniciens[0].id } },
      intervention: { connect: { id: interventions[0].id } },
      date: dateDepart(10),
      statut: "PRESENT",
    },
    {
      technicien: { connect: { id: techniciens[1].id } },
      intervention: { connect: { id: interventions[1].id } },
      date: dateDepart(5),
      statut: "PRESENT",
    },
    {
      technicien: { connect: { id: techniciens[0].id } },
      intervention: { connect: { id: interventions[2].id } },
      date: dateDepart(2),
      statut: "PRESENT",
    },
    {
      technicien: { connect: { id: techniciens[2].id } },
      intervention: { connect: { id: interventions[3].id } },
      date: dateDepart(1),
      statut: "ABSENT",
    },
    {
      technicien: { connect: { id: techniciens[1].id } },
      intervention: { connect: { id: interventions[4].id } },
      date: dateDepart(0),
      statut: "PRESENT",
    },
    {
      technicien: { connect: { id: techniciens[3].id } },
      intervention: { connect: { id: interventions[2].id } },
      date: dateDepart(2),
      statut: "MALADIE",
    },
  ];

  for (const p of presences) {
    await prisma.presence.create({ data: p });
  }

  console.log(`    ${presences.length} presences crees`);
}

// ===========================================================================
// 9. ETAPES CHANTIER
// ===========================================================================

async function seedEtapesChantier() {
  console.log("  Etapes chantier (deja creees avec les chantiers)");
}

// ===========================================================================
// 10. BONS DE COMMANDE
// ===========================================================================

async function seedBonsDeCommande() {
  console.log("  Bons de commande OMNIACOM...");

  for (const b of BONS_COMMANDE) {
    await prisma.bonDeCommande.create({
      data: {
        numeroBc: b.numeroBc,
        montantPo: b.montantPo,
        montantFacture: 0,
        montantRestant: b.montantPo,
        projetAssocie: b.projetAssocie,
      },
    });
  }

  console.log(`    ${BONS_COMMANDE.length} bons de commande crees`);
}

// ===========================================================================
// 11. LIGNES DE FACTURATION
// ===========================================================================

async function seedLignesFacturation() {
  console.log("  Lignes de facturation OMNIACOM...");

  const bcMap = {};
  const bons = await prisma.bonDeCommande.findMany();
  for (const b of bons) bcMap[b.numeroBc] = b.id;

  let count = 0;
  for (const [numeroBc, lignes] of Object.entries(LIGNES_PAR_BC)) {
    for (const l of lignes) {
      await prisma.ligneFacturation.create({
        data: {
          bonDeCommandeId: bcMap[numeroBc],
          montantHt: l.montantHt,
          statutPaiement: l.statutPaiement,
          description: "Import seed OMNIACOM",
        },
      });
      count++;
    }
  }

  for (const b of bons) {
    const lignes = await prisma.ligneFacturation.findMany({ where: { bonDeCommandeId: b.id } });
    const montantFacture = lignes.reduce((s, x) => s + Number(x.montantHt), 0);
    await prisma.bonDeCommande.update({
      where: { id: b.id },
      data: {
        montantFacture,
        montantRestant: Math.max(0, Number(b.montantPo) - montantFacture),
      },
    });
  }

  console.log(`    ${count} lignes de facturation crees`);
}

// ===========================================================================
// MAIN
// ===========================================================================

async function main() {
  console.log("\n============================================");
  console.log("  OMNIACOM - Remplissage de la base de donnees");
  console.log("============================================\n");

  // Nettoyage dans l'ordre inverse des dependances
  console.log("Nettoyage des donnees existantes...");
  await prisma.ligneFacturation.deleteMany();
  await prisma.chantierPhoto.deleteMany();
  await prisma.etapeChantier.deleteMany();
  await prisma.etapeModele.deleteMany();
  await prisma.bonDeCommande.deleteMany();
  await prisma.presence.deleteMany();
  await prisma.verificationEPI.deleteMany();
  await prisma.intervention.deleteMany();
  await prisma.chantier.deleteMany();
  await prisma.technicien.deleteMany();
  await prisma.site.deleteMany();
  await prisma.utilisateur.deleteMany();
  console.log("  Donnees existantes supprimees\n");

  // Seed dans l'ordre des dependances
  console.log("Creation des donnees de test...\n");
  await seedUtilisateurs();
  await seedTechniciens();
  await seedSites();
  await seedBonsDeCommande();
  await seedChantiers();
  await seedInterventions();
  await seedVerificationsEPI();
  await seedPresences();
  await seedEtapesChantier();
  await seedLignesFacturation();

  // Resume
  console.log("\n============================================");
  console.log("  Remplissage termine avec succes !");
  console.log("============================================");
  console.log(`  Utilisateurs        : ${await prisma.utilisateur.count()}`);
  console.log(`  Techniciens          : ${await prisma.technicien.count()}`);
  console.log(`  Sites                : ${await prisma.site.count()}`);
  console.log(`  Chantiers            : ${await prisma.chantier.count()}`);
  console.log(`  Interventions        : ${await prisma.intervention.count()}`);
  console.log(
    `  Verifications EPI    : ${await prisma.verificationEPI.count()}`,
  );
  console.log(`  Presences            : ${await prisma.presence.count()}`);
  console.log(`  Etapes chantier      : ${await prisma.etapeChantier.count()}`);
  console.log(`  Bons de commande     : ${await prisma.bonDeCommande.count()}`);
  console.log(
    `  Lignes facturation   : ${await prisma.ligneFacturation.count()}`,
  );
  console.log("============================================\n");
}

main()
  .catch((e) => {
    console.error("\nErreur lors du remplissage :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
