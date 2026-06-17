import { PrismaClient } from "../src/generated/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { config } from "dotenv";

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
// 4. EQUIPEMENTS
// ===========================================================================

async function seedEquipements() {
  console.log("  Equipements...");

  const equipements = [
    { nom: "Casque de protection", status: "CONFORME" },
    { nom: "Gants isolants", status: "CONFORME" },
    { nom: "Harnais de securite", status: "CONFORME" },
    { nom: "Lunettes de protection", status: "EN_RETARD" },
    { nom: "Chaussures de securite", status: "CONFORME" },
    { nom: "Masque anti-poussiere", status: "DEFECTUEUX" },
    { nom: "Protection auditive", status: "CONFORME" },
    { nom: "Detecteur de gaz", status: "HORS_SERVICE" },
  ];

  for (const e of equipements) {
    await prisma.equipements.create({ data: e });
  }

  console.log(`    ${equipements.length} equipements crees`);
}

// ===========================================================================
// 5. CHANTIERS
// ===========================================================================

async function seedChantiers() {
  console.log("  Chantiers...");

  const chantiers = [
    {
      entreprise: "BatiConstruct SARL",
      codeSite: "PAR-2024-001",
      nomSite: "Residence Les Jardins d'Arcadie",
      typeSite: "LOGEMENT_COLLECTIF",
      status: "ON_GOING",
      avancementPlanifie: 65.0,
      avancementReel: 72.0,
      dateGo: dateDepart(120),
    },
    {
      entreprise: "RenovPlus SAS",
      codeSite: "LYO-2024-002",
      nomSite: "Immeuble Le Commercial",
      typeSite: "BUREAUX",
      status: "ON_GOING",
      avancementPlanifie: 30.0,
      avancementReel: 28.0,
      dateGo: dateDepart(60),
    },
    {
      entreprise: "Construxion France",
      codeSite: "MAR-2024-003",
      nomSite: "Pole Sante Marseille Sud",
      typeSite: "SANTE",
      status: "APD_ON_GOING",
      avancementPlanifie: 10.0,
      avancementReel: 8.0,
      dateGo: dateDepart(30),
    },
    {
      entreprise: "BatiConstruct SARL",
      codeSite: "BOR-2024-004",
      nomSite: "Ecole Primaire Jules Ferry",
      typeSite: "EDUCATIF",
      status: "DONE",
      avancementPlanifie: 100.0,
      avancementReel: 100.0,
      dateGo: dateDepart(200),
    },
    {
      entreprise: "GreenBat Eco",
      codeSite: "LIL-2024-005",
      nomSite: "Residence Les Terrasses",
      typeSite: "LOGEMENT_COLLECTIF",
      status: "LANDLORD_ISSUE",
      avancementPlanifie: 50.0,
      avancementReel: 35.0,
      dateGo: dateDepart(90),
    },
  ];

  for (const c of chantiers) {
    await prisma.chantier.create({ data: c });
  }

  console.log(`    ${chantiers.length} chantiers crees`);
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
      statut: "CONFORME",
    },
    {
      technicien: { connect: { id: techniciens[1].id } },
      dateDerniereVerif: dateDepart(180),
      dateDemande: dateDepart(185),
      dateEnvoie: dateDepart(182),
      joursRetard: 0,
      prochaineDate: dateDansFutur(185),
      statut: "CONFORME",
    },
    {
      technicien: { connect: { id: techniciens[2].id } },
      dateDerniereVerif: dateDepart(45),
      dateDemande: dateDepart(50),
      dateEnvoie: dateDepart(48),
      joursRetard: 15,
      prochaineDate: dateDepart(-5),
      statut: "EN_RETARD",
    },
    {
      technicien: { connect: { id: techniciens[3].id } },
      dateDerniereVerif: dateDepart(200),
      dateDemande: dateDepart(205),
      dateEnvoie: dateDepart(202),
      joursRetard: 12,
      prochaineDate: dateDepart(-30),
      statut: "EN_RETARD",
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
  console.log("  Etapes chantier...");

  const chantiers = await prisma.chantier.findMany();

  const etapes = [
    // Chantier 1 (ON_GOING, 72% reel)
    {
      chantier: { connect: { id: chantiers[0].id } },
      nomEtape: "Terrassement",
      datePlanifiee: dateDepart(100),
      dateReelle: dateDepart(98),
      retardMinutes: 0,
      status: "TERMINE",
    },
    {
      chantier: { connect: { id: chantiers[0].id } },
      nomEtape: "Fondations",
      datePlanifiee: dateDepart(85),
      dateReelle: dateDepart(82),
      retardMinutes: 0,
      status: "TERMINE",
    },
    {
      chantier: { connect: { id: chantiers[0].id } },
      nomEtape: "Structure porteuse",
      datePlanifiee: dateDepart(60),
      dateReelle: dateDepart(58),
      retardMinutes: 0,
      status: "TERMINE",
    },
    {
      chantier: { connect: { id: chantiers[0].id } },
      nomEtape: "Couverture",
      datePlanifiee: dateDepart(35),
      dateReelle: dateDepart(33),
      retardMinutes: 0,
      status: "TERMINE",
    },
    {
      chantier: { connect: { id: chantiers[0].id } },
      nomEtape: "Installations electriques",
      datePlanifiee: dateDepart(20),
      dateReelle: new Date(),
      retardMinutes: 0,
      status: "EN_COURS",
    },
    {
      chantier: { connect: { id: chantiers[0].id } },
      nomEtape: "Finitions interieures",
      datePlanifiee: dateDansFutur(15),
      dateReelle: new Date(),
      retardMinutes: 0,
      status: "EN_ATTENTE",
    },
    // Chantier 2 (ON_GOING, 28% reel)
    {
      chantier: { connect: { id: chantiers[1].id } },
      nomEtape: "Demolition",
      datePlanifiee: dateDepart(45),
      dateReelle: dateDepart(43),
      retardMinutes: 0,
      status: "TERMINE",
    },
    {
      chantier: { connect: { id: chantiers[1].id } },
      nomEtape: "Gros oeuvre",
      datePlanifiee: dateDepart(20),
      dateReelle: dateDepart(22),
      retardMinutes: 120,
      status: "EN_RETARD",
    },
    {
      chantier: { connect: { id: chantiers[1].id } },
      nomEtape: "Facade",
      datePlanifiee: dateDansFutur(20),
      dateReelle: new Date(),
      retardMinutes: 0,
      status: "EN_ATTENTE",
    },
    // Chantier 4 (DONE)
    {
      chantier: { connect: { id: chantiers[3].id } },
      nomEtape: "Terrassement",
      datePlanifiee: dateDepart(180),
      dateReelle: dateDepart(178),
      retardMinutes: 0,
      status: "TERMINE",
    },
    {
      chantier: { connect: { id: chantiers[3].id } },
      nomEtape: "Fondations",
      datePlanifiee: dateDepart(160),
      dateReelle: dateDepart(155),
      retardMinutes: 0,
      status: "TERMINE",
    },
    {
      chantier: { connect: { id: chantiers[3].id } },
      nomEtape: "Structure",
      datePlanifiee: dateDepart(120),
      dateReelle: dateDepart(118),
      retardMinutes: 0,
      status: "TERMINE",
    },
    {
      chantier: { connect: { id: chantiers[3].id } },
      nomEtape: "Toiture",
      datePlanifiee: dateDepart(90),
      dateReelle: dateDepart(88),
      retardMinutes: 0,
      status: "TERMINE",
    },
    {
      chantier: { connect: { id: chantiers[3].id } },
      nomEtape: "Amenagements exterieurs",
      datePlanifiee: dateDepart(30),
      dateReelle: dateDepart(28),
      retardMinutes: 0,
      status: "TERMINE",
    },
  ];

  for (const e of etapes) {
    await prisma.etapeChantier.create({ data: e });
  }

  console.log(`    ${etapes.length} etapes chantier crees`);
}

// ===========================================================================
// 10. BONS DE COMMANDE
// ===========================================================================

async function seedBonsDeCommande() {
  console.log("  Bons de commande...");

  const chantiers = await prisma.chantier.findMany();

  const bdcs = [
    {
      chantier: { connect: { id: chantiers[0].id } },
      numeroBc: "BC-2024-001",
      montantPo: 45000.0,
      montantFacture: 42350.0,
      montantRestant: 2650.0,
      projetAssocie: "Electricite",
    },
    {
      chantier: { connect: { id: chantiers[0].id } },
      numeroBc: "BC-2024-002",
      montantPo: 32000.0,
      montantFacture: 32000.0,
      montantRestant: 0.0,
      projetAssocie: "Plomberie",
    },
    {
      chantier: { connect: { id: chantiers[1].id } },
      numeroBc: "BC-2024-003",
      montantPo: 28500.0,
      montantFacture: 14250.0,
      montantRestant: 14250.0,
      projetAssocie: "Menuiserie",
    },
    {
      chantier: { connect: { id: chantiers[3].id } },
      numeroBc: "BC-2024-004",
      montantPo: 15000.0,
      montantFacture: 15000.0,
      montantRestant: 0.0,
      projetAssocie: "Peinture",
    },
    {
      chantier: { connect: { id: chantiers[3].id } },
      numeroBc: "BC-2024-005",
      montantPo: 22000.0,
      montantFacture: 19800.0,
      montantRestant: 2200.0,
      projetAssocie: "Carrelage",
    },
    {
      chantier: { connect: { id: chantiers[4].id } },
      numeroBc: "BC-2024-006",
      montantPo: 18000.0,
      montantFacture: 0.0,
      montantRestant: 18000.0,
      projetAssocie: "Isolation",
    },
  ];

  for (const b of bdcs) {
    await prisma.bonDeCommande.create({ data: b });
  }

  console.log(`    ${bdcs.length} bons de commande crees`);
}

// ===========================================================================
// 11. LIGNES DE FACTURATION
// ===========================================================================

async function seedLignesFacturation() {
  console.log("  Lignes de facturation...");

  const bdcs = await prisma.bonDeCommande.findMany();

  const lignes = [
    {
      bonDeCommande: { connect: { id: bdcs[0].id } },
      montantHt: 12000.0,
      statutPaiement: "PAID",
      dateFacture: dateDepart(80),
      description: "Cables electriques lot 1",
    },
    {
      bonDeCommande: { connect: { id: bdcs[0].id } },
      montantHt: 18000.0,
      statutPaiement: "PAID",
      dateFacture: dateDepart(50),
      description: "Tableaux electriques",
    },
    {
      bonDeCommande: { connect: { id: bdcs[0].id } },
      montantHt: 12350.0,
      statutPaiement: "NOT_PAID",
      dateFacture: dateDepart(10),
      description: "Interrupteurs et prises",
    },
    {
      bonDeCommande: { connect: { id: bdcs[1].id } },
      montantHt: 32000.0,
      statutPaiement: "PAID",
      dateFacture: dateDepart(30),
      description: "Installation plomberie complete",
    },
    {
      bonDeCommande: { connect: { id: bdcs[2].id } },
      montantHt: 14250.0,
      statutPaiement: "NOT_PAID",
      dateFacture: dateDepart(5),
      description: "Pose menuiseries exterieures",
    },
    {
      bonDeCommande: { connect: { id: bdcs[3].id } },
      montantHt: 15000.0,
      statutPaiement: "PAID",
      dateFacture: dateDepart(90),
      description: "Peinture interieure",
    },
  ];

  for (const l of lignes) {
    await prisma.ligneFacturation.create({ data: l });
  }

  console.log(`    ${lignes.length} lignes de facturation crees`);
}

// ===========================================================================
// 12. LIENS VERIFICATION EPI <-> EQUIPEMENT
// ===========================================================================

async function seedLiaisonsEPI() {
  console.log("  Liaisons EPI-Equipements...");

  const verifications = await prisma.verificationEPI.findMany();
  const equipements = await prisma.equipements.findMany();

  const liaisons = [
    {
      verificationEpiId: verifications[0].id,
      equipementsId: equipements[0].id,
    },
    {
      verificationEpiId: verifications[0].id,
      equipementsId: equipements[1].id,
    },
    {
      verificationEpiId: verifications[0].id,
      equipementsId: equipements[4].id,
    },
    {
      verificationEpiId: verifications[1].id,
      equipementsId: equipements[0].id,
    },
    {
      verificationEpiId: verifications[1].id,
      equipementsId: equipements[6].id,
    },
    {
      verificationEpiId: verifications[2].id,
      equipementsId: equipements[3].id,
    },
    {
      verificationEpiId: verifications[2].id,
      equipementsId: equipements[5].id,
    },
    {
      verificationEpiId: verifications[3].id,
      equipementsId: equipements[2].id,
    },
    {
      verificationEpiId: verifications[3].id,
      equipementsId: equipements[7].id,
    },
  ];

  for (const l of liaisons) {
    await prisma.verificationEPI_Equipement.create({ data: l });
  }

  console.log(`    ${liaisons.length} liaisons EPI-Equipements crees`);
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
  await prisma.verificationEPI_Equipement.deleteMany();
  await prisma.ligneFacturation.deleteMany();
  await prisma.etapeChantier.deleteMany();
  await prisma.bonDeCommande.deleteMany();
  await prisma.presence.deleteMany();
  await prisma.verificationEPI.deleteMany();
  await prisma.intervention.deleteMany();
  await prisma.equipements.deleteMany();
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
  await seedEquipements();
  await seedChantiers();
  await seedInterventions();
  await seedVerificationsEPI();
  await seedPresences();
  await seedEtapesChantier();
  await seedBonsDeCommande();
  await seedLignesFacturation();
  await seedLiaisonsEPI();

  // Resume
  console.log("\n============================================");
  console.log("  Remplissage termine avec succes !");
  console.log("============================================");
  console.log(`  Utilisateurs        : ${await prisma.utilisateur.count()}`);
  console.log(`  Techniciens          : ${await prisma.technicien.count()}`);
  console.log(`  Sites                : ${await prisma.site.count()}`);
  console.log(`  Equipements          : ${await prisma.equipements.count()}`);
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
  console.log(
    `  Liaisons EPI-Equip   : ${await prisma.verificationEPI_Equipement.count()}`,
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
