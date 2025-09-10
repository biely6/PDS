import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./App.jsx";

export default function Register() {
  const { API } = useContext(AuthContext);
  const [form, setForm] = useState({ name:"", email:"", password:"" });
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const json = await res.json();
    if (json.ok) {
      alert("Cadastro realizado! Faça login.");
      nav("/login");
    } else {
      alert(json.error || "Erro no cadastro");
    }
  };

  return (
    <div className="card" style={{maxWidth:480, margin:"0 auto"}}>
      <h2 style={{marginTop:0}}>Cadastro</h2>
      <form onSubmit={submit}>
        <div className="field">
          <label>Nome</label>
          <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
        </div>
        <div className="field">
          <label>E-mail</label>
          <input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
        </div>
        <div className="field">
          <label>Senha</label>
          <input type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
        </div>
        <button className="btn">Criar conta</button>
      </form>
    </div>
  );
}