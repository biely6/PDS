import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from "fs";

async function seed() {
  const db = await open({
    filename: "cinema.db", // <<< usa cinema.db (não db.sqlite)
    driver: sqlite3.Database,
  });

  // Lê o seed.sql
  const sql = fs.readFileSync("seed.sql", "utf-8");

  // Executa o SQL (separando os comandos por ;)
  await db.exec(sql);

  console.log("✅ Banco cinema.db populado com sucesso!");
}

seed().catch((err) => {
  console.error("❌ Erro ao popular banco:", err);
});
