import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev-secret";

export const sign = (payload) => jwt.sign(payload, SECRET, { expiresIn: "7d" });

export const ensureAuth = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Token ausente" });
  try {
    const data = jwt.verify(token, SECRET);
    req.user = { id: data.id, name: data.name };
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
};