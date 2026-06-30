import * as service from "../services/verification-e-p-i.service.js";

export async function getAll(req, res, next) {
  try {
    const items = await service.findAll(req.query.search);
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const item = await service.findById(parseInt(req.params.id, 10));
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const item = await service.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const item = await service.update(parseInt(req.params.id, 10), req.body);
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await service.remove(parseInt(req.params.id, 10));
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function getHistorique(req, res, next) {
  try {
    const technicienId = parseInt(req.params.technicienId, 10);
    const { mois, annee } = req.query;
    const items = await service.findHistorique(technicienId, mois, annee);
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
}

export async function exportExcel(req, res, next) {
  try {
    const workbook = await service.exportExcel();
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=suivi-epi.xlsx");
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    next(err);
  }
}
