-- Apagar tabelas antigas, se existirem
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS filmes;
DROP TABLE IF EXISTS usuarios;

-- Criar tabela de usuários
CREATE TABLE usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
);

-- Criar tabela de filmes
CREATE TABLE filmes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    genero TEXT NOT NULL,
    ano INTEGER NOT NULL
);

-- Criar tabela de reviews
CREATE TABLE reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filme_id INTEGER NOT NULL,
    usuario_id INTEGER NOT NULL,
    comentario TEXT,
    nota INTEGER CHECK(nota >= 0 AND nota <= 10),
    FOREIGN KEY(filme_id) REFERENCES filmes(id),
    FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
);

-- Inserir usuários
INSERT INTO usuarios (nome, email) VALUES 
('João Silva', 'joao@email.com'),
('Maria Souza', 'maria@email.com'),
('Carlos Pereira', 'carlos@email.com');

-- Inserir filmes
INSERT INTO filmes (titulo, genero, ano) VALUES
('O Poderoso Chefão', 'Drama', 1972),
('Vingadores: Ultimato', 'Ação', 2019),
('Interestelar', 'Ficção Científica', 2014);

-- Inserir reviews
INSERT INTO reviews (filme_id, usuario_id, comentario, nota) VALUES
(1, 1, 'Filme incrível, um clássico!', 10),
(2, 2, 'Muito bom, mas um pouco longo.', 8),
(3, 3, 'Fantástico, me fez refletir muito.', 9);
