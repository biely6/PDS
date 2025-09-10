import db from '../db.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret'

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email, password são obrigatórios' })
    }

    const exists = await db.get('SELECT id FROM users WHERE email = ?', [email])
    if (exists) return res.status(409).json({ error: 'email já cadastrado' })

    const password_hash = bcrypt.hashSync(password, 10)
    const result = await db.run(
      'INSERT INTO users (name, email, password_hash) VALUES (?,?,?)',
      [name, email, password_hash]
    )

    const user = { id: result.lastID, name, email }
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' })
    res.status(201).json({ user, token })
  } catch (e) { next(e) }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const row = await db.get('SELECT * FROM users WHERE email = ?', [email])
    if (!row) return res.status(401).json({ error: 'credenciais inválidas' })

    const ok = bcrypt.compareSync(password, row.password_hash)
    if (!ok) return res.status(401).json({ error: 'credenciais inválidas' })

    const user = { id: row.id, name: row.name, email: row.email }
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' })
    res.json({ user, token })
  } catch (e) { next(e) }
}

export const auth = (req, res, next) => {
  try {
    const header = req.headers.authorization || ''
    const [type, token] = header.split(' ')
    if (type !== 'Bearer' || !token) return res.status(401).json({ error: 'token ausente' })

    const payload = jwt.verify(token, JWT_SECRET)
    req.user = payload
    next()
  } catch (e) {
    return res.status(401).json({ error: 'token inválido' })
  }
}
