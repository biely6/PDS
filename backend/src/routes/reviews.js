import { Router } from "express";
import Review from "../models/Review.js";
import { ensureAuth } from "../middlewares/auth.js";

const router = Router();

router.post("/", ensureAuth, async (req, res) => {
  try {
    const { film_id, rating, comment } = req.body;
    if (!film_id || !rating) return res.status(400).json({ error: "film_id e rating são obrigatórios" });
    const review = await Review.createOrUpdate({ userId: req.user.id, filmId: film_id, rating, comment });
    const stats = await Review.forFilm(film_id).then(list => {
      const avg = list.length ? (list.reduce((s, r) => s + r.rating, 0) / list.length).toFixed(1) : 0;
      return { avgRating: Number(avg), reviewCount: list.length };
    });
    res.json({ ok: true, stats });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erro ao salvar review" });
  }
});

router.get("/film/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const list = await Review.forFilm(id);
    const stats = list.length ? { avgRating: Number((list.reduce((s, r) => s + r.rating, 0) / list.length).toFixed(1)), reviewCount: list.length } : { avgRating: 0, reviewCount: 0 };
    res.json({ reviews: list, stats });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erro ao buscar reviews" });
  }
});

export default router;