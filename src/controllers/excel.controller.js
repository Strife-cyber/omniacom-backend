import * as exportService from "../services/excel-export.service.js";
import * as importService from "../services/excel-import.service.js";
import * as utilisateurService from "../services/utilisateur.service.js";

function sendBuffer(res, buffer, filename) {
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.send(Buffer.from(buffer));
}

export async function exportDailyTracker(req, res, next) {
  try {
    const buffer = await exportService.exportDailyTracker();
    sendBuffer(res, buffer, "daily-reporting-tracker.xlsx");
  } catch (err) {
    next(err);
  }
}

export async function exportBcSuivi(req, res, next) {
  try {
    const buffer = await exportService.exportBcSuivi();
    sendBuffer(res, buffer, "suivi-bc-cw-ocm.xlsx");
  } catch (err) {
    next(err);
  }
}

export async function exportChantiers(req, res, next) {
  try {
    const buffer = await exportService.exportChantiersList();
    sendBuffer(res, buffer, "chantiers.xlsx");
  } catch (err) {
    next(err);
  }
}

export async function exportUtilisateurs(req, res, next) {
  try {
    const users = await utilisateurService.findAll();
    const buffer = await exportService.exportUtilisateurs(users);
    sendBuffer(res, buffer, "utilisateurs.xlsx");
  } catch (err) {
    next(err);
  }
}

export async function importDailyTracker(req, res, next) {
  try {
    console.log("[IMPORT] daily-tracker - req.file:", req.file);
    console.log("[IMPORT] daily-tracker - req.files:", req.files);
    console.log("[IMPORT] daily-tracker - champs reçus:", Object.keys(req.body || {}));
    if (!req.file) {
      console.warn("[IMPORT] Aucun fichier reçu. Champ attendu: 'file'");
      res.status(400).json({ success: false, message: "Fichier Excel requis (champ 'file')" });
      return;
    }
    const result = await importService.importDailyTracker(req.file.path);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error("[IMPORT] daily-tracker erreur:", err.message, err.stack);
    next(err);
  }
}

export async function importBcSuivi(req, res, next) {
  try {
    console.log("[IMPORT] bc-suivi - req.file:", req.file);
    console.log("[IMPORT] bc-suivi - req.files:", req.files);
    console.log("[IMPORT] bc-suivi - champs reçus:", Object.keys(req.body || {}));
    if (!req.file) {
      console.warn("[IMPORT] Aucun fichier reçu. Champ attendu: 'file'");
      res.status(400).json({ success: false, message: "Fichier Excel requis (champ 'file')" });
      return;
    }
    const result = await importService.importBcSuivi(req.file.path);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error("[IMPORT] bc-suivi erreur:", err.message, err.stack);
    next(err);
  }
}
