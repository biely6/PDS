import db from "../db.js";
import bcrypt from "bcryptjs";

export default class User {
  constructor({ id, name, email, password_hash, created_at }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password_hash = password_hash;
    this.created_at = created_at;
  }

  static async create({ name, email, password }) {
    const hash = await bcrypt.hash(password, 10);
    const result = await db.run(
      `INSERT INTO users (name, email, password_hash) VALUES (?,?,?)`,
      [name, email, hash]
    );
    return new User({ id: result.lastID, name, email, password_hash: hash });
  }

  static async findByEmail(email) {
    const row = await db.get(`SELECT * FROM users WHERE email = ?`, [email]);
    return row ? new User(row) : null;
  }

  async checkPassword(password) {
    return await bcrypt.compare(password, this.password_hash);
  }
}