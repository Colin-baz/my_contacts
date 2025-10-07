import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: ""
  });

  const navigate = useNavigate();
  const API_URL = "http://localhost:5000/api/contacts";

  const getToken = () => {
    return localStorage.getItem("token");
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError("");
      const token = getToken();
      
      if (!token) {
        navigate("/login");
        return;
      }
      
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setContacts(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors du chargement des contacts");
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    
    try {
      setError("");
      const token = getToken();
      
      await axios.post(API_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      setFormData({ firstName: "", lastName: "", phone: "" });
      setShowForm(false);
      fetchContacts();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la création du contact");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    try {
      setError("");
      const token = getToken();
      
      await axios.put(`${API_URL}/${currentContact._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      setFormData({ firstName: "", lastName: "", phone: "" });
      setIsEditing(false);
      setCurrentContact(null);
      setShowForm(false);
      fetchContacts();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la mise à jour du contact");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce contact ?")) {
      return;
    }

    try {
      setError("");
      const token = getToken();
      
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      fetchContacts();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la suppression du contact");
    }
  };

  const handleEdit = (contact) => {
    setIsEditing(true);
    setCurrentContact(contact);
    setFormData({
      firstName: contact.firstName,
      lastName: contact.lastName,
      phone: contact.phone
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setFormData({ firstName: "", lastName: "", phone: "" });
    setIsEditing(false);
    setCurrentContact(null);
    setShowForm(false);
    setError("");
  };

  const handleShowCreateForm = () => {
    setShowForm(true);
    setIsEditing(false);
    setFormData({ firstName: "", lastName: "", phone: "" });
  };

  if (loading) {
    return <div className="container"><p>Chargement...</p></div>;
  }

  return (
    <div className="container">
      <h2>Mes Contacts</h2>
      
      {error && <div className="error-message">{error}</div>}

      {!showForm && (
        <button onClick={handleShowCreateForm} className="btn-primary"> Ajouter un contact </button>
      )}

      {showForm && (
          <form onSubmit={isEditing ? handleUpdate : handleCreate}>
              <label htmlFor="firstName">Prénom:</label>
              <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Prénom" required/>
              <label htmlFor="lastName">Nom:</label>
              <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange}placeholder="Nom" required
              />

              <label htmlFor="phone">Téléphone:</label>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="Téléphone" required minLength="10" maxLength="20"/>
              <button type="submit" className="btn-primary">
                {isEditing ? "Mettre à jour" : "Créer"}
              </button>
              <button type="button" onClick={handleCancel} className="btn-secondary">
                Annuler
              </button>
          </form>
      )}

      <div className="contacts-list">
        <h3>Liste des contacts ({contacts.length})</h3>
          <table className="contacts-table">
            <thead>
              <tr>
                <th>Prénom</th>
                <th>Nom</th>
                <th>Téléphone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact._id}>
                  <td>{contact.firstName}</td>
                  <td>{contact.lastName}</td>
                  <td>{contact.phone}</td>
                  <td className="actions">
                    <button onClick={() => handleEdit(contact)} className="btn-edit"> Modifier </button>
                    <button onClick={() => handleDelete(contact._id)} className="btn-delete"> Supprimer </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
    </div>
  );
};

export default Contacts;