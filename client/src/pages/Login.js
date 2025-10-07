import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Erreur de connexion");
        return;
      }

      if (data.accessToken) {
        localStorage.setItem("token", data.accessToken);
        navigate("/contacts");
      } else {
        setError("Aucun token reçu du serveur");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur");
    }
  };

  return (
    <div className="container">
      <h2>Connexion</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} value={formData.email} required/>
        <input type="password" name="password" placeholder="Mot de passe" onChange={handleChange}value={formData.password} required/>
        <button type="submit"> Se connecter </button>
      </form>
    </div>
  );
};

export default Login;
