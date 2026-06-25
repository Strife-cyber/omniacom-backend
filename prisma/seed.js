import { PrismaClient } from "../src/generated/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { config } from "dotenv";

config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const SALT_ROUNDS = 12;

async function hashMdp(mdp) {
  return bcrypt.hash(mdp, SALT_ROUNDS);
}

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

async function main() {
  console.log("\n============================================");
  console.log("  OMNIACOM - Initialisation des comptes");
  console.log("============================================\n");

  await seedUtilisateurs();

  console.log("\n============================================");
  console.log("  Initialisation terminee !");
  console.log("============================================");
  console.log(`  Utilisateurs : ${await prisma.utilisateur.count()}`);
  console.log("============================================\n");
}

main()
  .catch((e) => {
    console.error("\nErreur :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
