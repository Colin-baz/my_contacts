# MyContacts - Application de Gestion de Contacts

Application Full Stack de gestion de contacts avec authentification JWT, développée avec Node.js/Express et React.

## 🚀 Technologies

**Backend:** Node.js, Express 5.1, MongoDB, Mongoose, JWT, bcryptjs, Swagger  
**Frontend:** React 19.2, React Router DOM, Axios

## 📦 Installation

```bash
# Installer les dépendances du serveur
cd server
npm install

# Installer les dépendances du client
cd ../client
npm install
```

## ⚙️ Configuration

Créer un fichier `.env` dans le dossier `server/` :

```env
URL_ATLAS=<votre-URL-MongoDB-Atlas>
PORT=5000
JWT_SECRET=votre_clé_secrète
```

## 🚀 Démarrage

### Serveur (Backend)
```bash
cd server
npm run dev    # Mode développement
npm start      # Mode production
```
Le serveur démarre sur **http://localhost:5000**

### Client (Frontend)
```bash
cd client
npm start
```
Le client démarre sur **http://localhost:3001**

## 📜 Scripts

### Serveur
- `npm start` - Démarre le serveur
- `npm run dev` - Mode développement avec nodemon
- `npm test` - Lance les tests (30 tests : 9 auth + 21 contacts)

### Client
- `npm start` - Démarre l'application React
- `npm run build` - Build de production
- `npm test` - Lance les tests

## 🔌 API Endpoints

**Base URL:** `http://localhost:5000`

### Authentification

#### Inscription
```http
POST /auth/register
Content-Type: application/json

{
  "email": "test@test.com",
  "password": "password123"
}
```

#### Connexion
```http
POST /auth/login
Content-Type: application/json

{
  "email": "test@test.com",
  "password": "password123"
}
```
Retourne un token JWT à utiliser dans les requêtes suivantes.

#### Liste des utilisateurs (protégé)
```http
GET /auth/users
Authorization: Bearer <token>
```

---

### Contacts (Routes protégées)

> ⚠️ Toutes les routes nécessitent un token JWT : `Authorization: Bearer <token>`

#### Récupérer tous les contacts
```http
GET /api/contacts
```

#### Créer un contact
```http
POST /api/contacts
Content-Type: application/json

{
  "name": "Colin BAZELAIRE",
  "email": "colin.bazelaire@example.com",
  "phone": "123456789"
}
```

#### Modifier un contact
```http
PUT /api/contacts/:id
Content-Type: application/json

{
  "name": "Colin BAZ",
  "email": "colin.baz@example.com",
  "phone": "987654321"
}
```

#### Supprimer un contact
```http
DELETE /api/contacts/:id
```

## 🔑 Identifiants de test

```
Email: test@test.com
Password: password123
```

## 📚 Documentation API (Swagger)

Documentation interactive disponible sur :
```
http://localhost:5000/api-docs
https://my-contacts-4idu.onrender.com/api-docs
```

## 🧪 Tests

```bash
cd server
npm test
```

**Couverture :**
- ✅ 9 tests d'authentification (register, login, validation)
- ✅ 21 tests de contacts (CRUD, validation, sécurité)
- ✅ Codes HTTP : 200, 201, 400, 401, 404, 412


## 🔒 Sécurité

- Authentification JWT sur toutes les routes de contacts
- Hachage des mots de passe avec bcryptjs
- Isolation des utilisateurs (accès uniquement à ses propres contacts)
- Validation des données avec middleware
- CORS configuré

## 🌐 Déploiement

- **Frontend:** https://mycontactsproject.netlify.app
- **Backend:** https://my-contacts-4idu.onrender.com/
