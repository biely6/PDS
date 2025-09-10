import { Router } from "express";
import User from "../models/User.js";
import { sign } from "../middlewares/auth.js";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "Dados obrigatórios" });
    const existing = await User.findByEmail(email);
    if (existing) return res.status(409).json({ error: "E-mail já cadastrado" });
    await User.create({ name, email, password });
    res.status(201).json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erro no cadastro" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user) return res.status(401).json({ error: "Credenciais inválidas" });
    const ok = await user.checkPassword(password);
    if (!ok) return res.status(401).json({ error: "Credenciais inválidas" });
    const token = sign({ id: user.id, name: user.name });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erro no login" });
  }
});

export default router;