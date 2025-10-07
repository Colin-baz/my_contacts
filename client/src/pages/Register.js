import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
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
      const res = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Erreur lors de l'inscription");
        return;
      }

      navigate("/login");
    } catch (err) {
      setError("Erreur de connexion au serveur");
    }
  };

  return (
    <div className="container">
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} value={formData.email} required />
        <input type="password" name="password" placeholder="Mot de passe" onChange={handleChange} value={formData.password} required/>
        <button type="submit"> S'inscrire</button>
      </form>
    </div>
  );
};

export default Register;
