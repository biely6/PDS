import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./App.jsx";

export default function Login() {
  const { API, setUser } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const json = await res.json();
    if (json.token) {
      localStorage.setItem("token", json.token);
      localStorage.setItem("user", JSON.stringify(json.user));
      setUser(json.user);
      nav("/");
    } else {
      alert(json.error || "Erro no login");
    }
  };

  return (
    <div className="card" style={{maxWidth:480, margin:"0 auto"}}>
      <h2 style={{marginTop:0}}>Login</h2>
      <form onSubmit={submit}>
        <div className="field">
          <label>E-mail</label>
          <input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
        </div>
        <div className="field">
          <label>Senha</label>
          <input type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
        </div>
        <button className="btn">Entrar</button>
      </form>
    </div>
  );
}