import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";

const router = express.Router();
const SECRET = "segredo_super_secreto"; // em produção use variável de ambiente

// Registro
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Preencha todos os campos" });
  }
  const hash = await bcrypt.hash(password, 10);

  try {
    await db.run(
      "INSERT INTO users (name, email, password_hash) VALUES (?,?,?)",
      [name, email, hash]
    );
    res.json({ message: "Usuário registrado com sucesso!" });
  } catch (err) {
    res.status(400).json({ error: "E-mail já cadastrado" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);

  if (!user) return res.status(400).json({ error: "Usuário não encontrado" });

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(400).json({ error: "Senha incorreta" });

  const token = jwt.sign({ id: user.id, name: user.name }, SECRET, {
    expiresIn: "1h",
  });

  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

export default router;
