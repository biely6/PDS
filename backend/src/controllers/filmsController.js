import db from '../db.js'

export const list = async (req, res, next) => {
  try {
    const genero = req.query.genero
    let rows
    if (genero) {
      rows = await db.all(
        'SELECT * FROM films WHERE lower(genre) = lower(?) ORDER BY title',
        [genero]
      )
    } else {
      rows = await db.all('SELECT * FROM films ORDER BY title')
    }
    res.json(rows)
  } catch (e) { next(e) }
}

export const ranking = async (req, res, next) => {
  try {
    const rows = await db.all(`
      SELECT f.id, f.title, f.genre, f.year,
             ROUND(AVG(r.rating), 2) AS media,
             COUNT(r.id) as total_reviews
      FROM films f
      JOIN reviews r ON r.film_id = f.id
      GROUP BY f.id
      HAVING total_reviews > 0
      ORDER BY media DESC, total_reviews DESC
      LIMIT 10
    `)
    res.json(rows)
  } catch (e) { next(e) }
}

export const reviewsByFilm = async (req, res, next) => {
  try {
    const { id } = req.params
    const rows = await db.all(`
      SELECT r.id, r.rating, r.comment, r.created_at,
             u.id as user_id, u.name as user_name
      FROM reviews r
      JOIN users u ON u.id = r.user_id
      WHERE r.film_id = ?
      ORDER BY r.created_at DESC
    `, [id])
    res.json(rows)
  } catch (e) { next(e) }
}
