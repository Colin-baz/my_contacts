const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.URL_ATLAS);
    console.log("Connexion réussie");
  } catch (err) {
    console.error("Erreur de connexion:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

