import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import fs from 'fs';

const dbPath = path.resolve(process.cwd(), 'cinema.db');
const firstTime = !fs.existsSync(dbPath);

const db = await open({
  filename: dbPath,
  driver: sqlite3.Database
});

await db.exec('PRAGMA foreign_keys = ON');

await db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS films (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  genre TEXT NOT NULL,
  year INTEGER,
  synopsis TEXT
);

CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  film_id INTEGER NOT NULL REFERENCES films(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(user_id, film_id)
);
`);

if (firstTime) {
  const films = [
    ['A Origem', 'Ação', 2010, 'Um ladrão que invade sonhos tenta realizar o assalto perfeito.'],
    ['O Senhor dos Anéis: A Sociedade do Anel', 'Fantasia', 2001, 'Um hobbit inicia uma jornada para destruir um anel maligno.'],
    ['Parasita', 'Drama', 2019, 'Uma família pobre se infiltra na vida de uma família rica.'],
    ['Interestelar', 'Ficção Científica', 2014, 'Exploradores viajam por um buraco de minhoca em busca de novo lar.'],
    ['Cidade de Deus', 'Crime', 2002, 'A vida nas favelas do Rio de Janeiro entre crime e esperança.'],
    ['Mad Max: Estrada da Fúria', 'Ação', 2015, 'Fuga frenética por um deserto pós-apocalíptico.'],
    ['Whiplash', 'Drama', 2014, 'Um jovem baterista enfrenta um maestro implacável.'],
    ['Vingadores: Ultimato', 'Ação', 2019, 'Heróis tentam desfazer a dizimação do universo.'],
    ['Coco', 'Animação', 2017, 'Garoto viaja à Terra dos Mortos para entender sua família.'],
    ['O Poderoso Chefão', 'Crime', 1972, 'A saga da família mafiosa Corleone.']
  ];
  for (const f of films) {
    await db.run('INSERT INTO films (title, genre, year, synopsis) VALUES (?,?,?,?)', f);
  }
}

export default db;