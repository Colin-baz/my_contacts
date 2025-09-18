const express = require('express');
const mongoose = require('mongoose');
require("dotenv").config();
import User from '/models/User.js';

const app = express();

const PORT = process.env.PORT || 5000;

const dbURL = process.env.URL_ATLAS;

mongoose.connect(dbURL);
const db = mongoose.connection;

db.once('open', () => {
    console.log('Connexion réussie');
});

db.on('error', (error) => {
    console.error('erreur de connexion:', error);
});

const contact = new User({
    email: 'test@a.com',
    passwordHashed: '123'
});

await contact.save();

app.get('/', (_req, res) => {
  res.send('Hello World');  
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);  
});