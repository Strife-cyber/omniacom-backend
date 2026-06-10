import { prisma } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";

export async function findAll() {
  return prisma.utilisateur.findMany();
}

export async function findById(id) {
  const utilisateur = await prisma.utilisateur.findUnique({ where: { id } });

  if (!utilisateur) {
    throw new ApiError(404, "Utilisateur introuvable");
  }

  return utilisateur;
}

export async function create(data) {
  return prisma.utilisateur.create({ data });
}

export async function update(id, data) {
  await findById(id);
  return prisma.utilisateur.update({ where: { id }, data });
}

export async function remove(id) {
  await findById(id);
  return prisma.utilisateur.delete({ where: { id } });
}
