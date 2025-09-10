import express from "express";
import cors from "cors";
import filmsRoutes from "./src/routes/films.js";

const app = express();
app.use(cors());
app.use(express.json());

// rotas
app.use("/filmes", filmsRoutes);

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
