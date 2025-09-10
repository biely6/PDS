import db from "../db.js";

export default class Film {
  constructor({ id, title, genre, year, synopsis }) {
    this.id = id;
    this.title = title;
    this.genre = genre;
    this.year = year;
    this.synopsis = synopsis;
  }

  static async all() {
    const rows = await db.all(`
      SELECT f.*, ROUND(AVG(r.rating),1) AS avgRating, COUNT(r.id) AS reviewCount
      FROM films f
      LEFT JOIN reviews r ON r.film_id = f.id
      GROUP BY f.id
      ORDER BY f.title;
    `);
    return rows.map(r => new Film(r));
  }

  static async findById(id) {
    const row = await db.get(`SELECT * FROM films WHERE id = ?`, [id]);
    return row ? new Film(row) : null;
  }
}