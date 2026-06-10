import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";

config({ path: "../.env" });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Debut du remplissage de la base de donnees...\n");

  // Exemple : Creer des utilisateurs de test
  // Decommentez ces lignes une fois le modele Utilisateur active :
  //
  // const utilisateurs = [
  //   { email: "admin@omniacom.fr", nom: "Admin", motDePasse: "password123", role: "ADMIN" },
  //   { email: "user@omniacom.fr", nom: "Utilisateur", motDePasse: "password123", role: "UTILISATEUR" },
  // ];
  //
  // for (const u of utilisateurs) {
  //   const created = await prisma.utilisateur.create({ data: u });
  //   console.log(`Utilisateur cree : ${created.email}`);
  // }

  console.log("\nRemplissage termine avec succes !");
}

main()
  .catch((e) => {
    console.error("Erreur lors du remplissage :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
