import { prisma } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";

export async function findAll(page = 1, pageSize = 20) {
  const skip = (page - 1) * pageSize;

  const [data, total] = await Promise.all([
    prisma.utilisateur.findMany({
      skip,
      take: pageSize,
    }),
    prisma.utilisateur.count(),
  ]);

  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
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
