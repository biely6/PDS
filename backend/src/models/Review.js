import db from "../db.js";

export default class Review {
  constructor({ id, user_id, film_id, rating, comment, created_at }) {
    this.id = id;
    this.user_id = user_id;
    this.film_id = film_id;
    this.rating = rating;
    this.comment = comment;
    this.created_at = created_at;
  }

  static async createOrUpdate({ userId, filmId, rating, comment }) {
    const exists = await db.get(
      `SELECT id FROM reviews WHERE user_id = ? AND film_id = ?`,
      [userId, filmId]
    );

    if (exists) {
      await db.run(
        `UPDATE reviews SET rating=?, comment=?, created_at=datetime('now') WHERE id=?`,
        [rating, comment ?? null, exists.id]
      );
      return new Review({ id: exists.id, user_id: userId, film_id: filmId, rating, comment });
    } else {
      const result = await db.run(
        `INSERT INTO reviews (user_id, film_id, rating, comment) VALUES (?,?,?,?)`,
        [userId, filmId, rating, comment ?? null]
      );
      return new Review({ id: result.lastID, user_id: userId, film_id: filmId, rating, comment });
    }
  }

  static async forFilm(filmId) {
    const rows = await db.all(
      `SELECT r.id, r.rating, r.comment, r.created_at, u.name as user_name
       FROM reviews r
       JOIN users u ON u.id = r.user_id
       WHERE r.film_id = ?
       ORDER BY r.created_at DESC`,
      [filmId]
    );
    return rows.map(r => new Review(r));
  }
}