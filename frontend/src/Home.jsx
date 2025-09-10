import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./App.jsx";

export default function Home() {
  const { API } = useContext(AuthContext);
  const [films, setFilms] = useState([]);

  useEffect(() => {
    fetch(`${API}/filmes`).then(r => r.json()).then(setFilms);
  }, [API]);

  return (
    <div className="card">
      <h2 style={{marginTop:0}}>Lista de Filmes</h2>
      <div className="grid">
        {films.map(f => (
          <div key={f.id} className="card">
            <h3 style={{marginTop:0}}><Link to={`/filme/${f.id}`}>{f.title}</Link></h3>
            <div className="muted">{f.year} • {f.genre}</div>
            <p className="muted">{f.synopsis}</p>
            <div className="rating">
              <span className="tag">⭐ {f.avgRating || 0}</span>
              <span className="tag">{f.reviewCount} review(s)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}