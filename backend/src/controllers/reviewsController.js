import db from '../db.js'

export const createOrUpdate = async (req, res, next) => {
  try {
    const userId = req.user?.id
    const { film_id, rating, comment } = req.body

    if (!userId) return res.status(401).json({ error: 'não autenticado' })
    if (!film_id || !rating) return res.status(400).json({ error: 'film_id e rating são obrigatórios' })
    if (rating < 1 || rating > 5) return res.status(400).json({ error: 'rating deve ser 1-5' })

    const existing = await db.get(
      'SELECT id FROM reviews WHERE user_id = ? AND film_id = ?',
      [userId, film_id]
    )

    if (existing) {
      await db.run(
        'UPDATE reviews SET rating = ?, comment = ?, created_at = datetime("now") WHERE id = ?',
        [rating, comment || null, existing.id]
      )
      const updated = await db.get('SELECT * FROM reviews WHERE id = ?', [existing.id])
      return res.json(updated)
    } else {
      const result = await db.run(
        'INSERT INTO reviews (user_id, film_id, rating, comment) VALUES (?,?,?,?)',
        [userId, film_id, rating, comment || null]
      )
      const created = await db.get('SELECT * FROM reviews WHERE id = ?', [result.lastID])
      return res.status(201).json(created)
    }
  } catch (e) { next(e) }
}
