import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "./App.jsx";

export default function FilmReviews() {
  const { id } = useParams();
  const { API, user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [form, setForm] = useState({ rating: 5, comment: "" });
  const token = localStorage.getItem("token");

  const load = () => {
    fetch(`${API}/filmes/${id}`).then(r => r.json()).then(setData);
  };

  useEffect(() => { load(); }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ film_id: Number(id), rating: Number(form.rating), comment: form.comment })
    });
    const json = await res.json();
    if (json.ok) {
      setForm({ rating: 5, comment: "" });
      load();
    } else {
      alert(json.error || "Erro ao salvar");
    }
  };

  if (!data) return <div className="card">Carregando...</div>;

  const { film, stats, reviews } = data;

  return (
    <div className="card">
      <h2 style={{marginTop:0}}>{film.title}</h2>
      <div className="muted">{film.year} • {film.genre}</div>
      <p className="muted">{film.synopsis}</p>

      <div className="rating" style={{margin:"8px 0 16px"}}>
        <span className="tag">⭐ {stats.avgRating || 0}</span>
        <span className="tag">{stats.reviewCount} review(s)</span>
      </div>

      {user ? (
        <form onSubmit={submit} className="card" style={{marginBottom:16}}>
          <h3 style={{marginTop:0}}>Deixe sua avaliação</h3>
          <div className="field">
            <label>Nota (1 a 5)</label>
            <select value={form.rating} onChange={e => setForm({...form, rating: e.target.value})}>
              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Comentário</label>
            <textarea rows="3" value={form.comment} onChange={e => setForm({...form, comment:e.target.value})}></textarea>
          </div>
          <button className="btn">Salvar avaliação</button>
        </form>
      ) : (
        <p className="muted">Faça login para avaliar.</p>
      )}

      <h3>Comentários</h3>
      {reviews.length === 0 && <p className="muted">Ainda não há comentários.</p>}
      <div className="grid">
        {reviews.map(r => (
          <div className="card" key={r.id}>
            <div className="rating"><span className="tag">⭐ {r.rating}</span><span className="muted">por {r.user_name}</span></div>
            <p>{r.comment || <span className="muted">sem comentário</span>}</p>
            <div className="muted" style={{fontSize:12}}>{new Date(r.created_at).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}