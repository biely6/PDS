import express from "express";
import cors from "cors";
import authRoutes from "./src/routes/auth.js";
import filmsRoutes from "./src/routes/films.js";
import reviewsRoutes from "./src/routes/reviews.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/filmes", filmsRoutes);
app.use("/reviews", reviewsRoutes);

app.get("/", (_req, res) => res.json({ ok: true, service: "cine-rate API (POO)" }));

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});