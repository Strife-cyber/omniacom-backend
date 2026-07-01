import multer from "multer";
import { mkdirSync } from "fs";
import { join, extname } from "path";
import { randomUUID } from "crypto";
import { UPLOADS_DIR } from "../config/env.js";

const ALLOWED = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

function storageSubdir(subdir) {
  const dest = join(UPLOADS_DIR, subdir);
  mkdirSync(dest, { recursive: true });
  return multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, dest),
    filename: (_req, file, cb) => {
      const ext = extname(file.originalname).toLowerCase();
      cb(null, `${randomUUID()}${ext}`);
    },
  });
}

function fileFilter(_req, file, cb) {
  const ext = extname(file.originalname).toLowerCase();
  if (!ALLOWED.has(ext)) {
    cb(new Error("Format image non supporte (jpg, png, webp, gif)"));
    return;
  }
  cb(null, true);
}

export const uploadUserPhoto = multer({
  storage: storageSubdir("users"),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
}).single("photo");

export const uploadChantierPhoto = multer({
  storage: storageSubdir("chantiers"),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter,
}).single("photo");

const _excelMulter = multer({
  storage: storageSubdir("imports"),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = extname(file.originalname).toLowerCase();
    if (ext !== ".xlsx" && ext !== ".xls") {
      cb(new Error("Fichier Excel (.xlsx) requis"));
      return;
    }
    cb(null, true);
  },
});

// Accepte n'importe quel nom de champ (file, excel, document, upload…)
export function uploadExcel(req, res, next) {
  _excelMulter.any()(req, res, (err) => {
    if (err) return next(err);
    // Normalise : met le premier fichier reçu dans req.file
    if (!req.file && Array.isArray(req.files) && req.files.length > 0) {
      req.file = req.files[0];
    }
    next();
  });
}

/** Construit l URL publique d un fichier uploade. */
export function buildUploadUrl(subdir, filename) {
  return `/uploads/${subdir}/${filename}`;
}
