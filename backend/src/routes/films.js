import { Router } from "express";
import Film from "../models/Film.js";
import db from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const films = await Film.all();
    res.json(films);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erro ao buscar filmes" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const film = await Film.findById(id);
    if (!film) return res.status(404).json({ error: "Filme não encontrado" });

    const stats = await db.get(
      `SELECT ROUND(AVG(rating),1) avgRating, COUNT(*) reviewCount FROM reviews WHERE film_id = ?`,
      [id]
    );

    const reviews = await db.all(
      `SELECT r.id, r.rating, r.comment, r.created_at, u.name as user_name
       FROM reviews r JOIN users u ON u.id = r.user_id WHERE r.film_id = ? ORDER BY r.created_at DESC`,
      [id]
    );

    res.json({ film, stats: { avgRating: stats?.avgRating ?? 0, reviewCount: stats?.reviewCount ?? 0 }, reviews });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erro ao buscar detalhes" });
  }
});

export default router;