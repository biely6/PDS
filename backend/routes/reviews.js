import express from "express";
import db from "../db.js";

const router = express.Router();

// GET → Listar todas as avaliações de um filme
router.get("/:filmeId", (req, res) => {
  const { filmeId } = req.params;
  try {
    const reviews = db.prepare(`
      SELECT r.id, r.nota, r.comentario, u.nome as usuario
      FROM reviews r
      JOIN usuarios u ON u.id = r.usuario_id
      WHERE r.filme_id = ?
    `).all(filmeId);

    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar avaliações" });
  }
});

// POST → Criar nova avaliação
router.post("/", (req, res) => {
  const { usuario_id, filme_id, nota, comentario } = req.body;

  if (!usuario_id || !filme_id || !nota) {
    return res.status(400).json({ error: "Campos obrigatórios faltando" });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO reviews (usuario_id, filme_id, nota, comentario)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(usuario_id, filme_id, nota, comentario || "");

    res.json({ id: result.lastInsertRowid, usuario_id, filme_id, nota, comentario });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao salvar avaliação" });
  }
});

export default router;
