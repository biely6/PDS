import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./Home.jsx";
import FilmReviews from "./FilmReviews.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";

const API = "http://localhost:3000";

export const AuthContext = React.createContext(null);

export default function App() {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, API }}>
      <div className="container">
        <nav className="navbar">
          <div className="nav-left">
            <Link to="/" className="brand">🎬 cine-rate</Link>
            <Link to="/">Home</Link>
          </div>
          <div>
            {user ? (
              <>
                <span className="muted" style={{marginRight:12}}>Olá, {user.name}</span>
                <button className="btn outline" onClick={logout}>Sair</button>
              </>
            ) : (
              <>
                <Link to="/login" style={{marginRight:8}}>Login</Link>
                <Link to="/register">Registrar</Link>
              </>
            )}
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/filme/:id" element={<FilmReviews />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </AuthContext.Provider>
  );
}