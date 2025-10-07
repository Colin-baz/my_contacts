require("dotenv").config();
const express = require('express');
const connectDB = require("./config/db");
const { swaggerUi, specs } = require("./config/swagger");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: ["http://localhost:3001", "https://mycontactsproject.netlify.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true 
}));

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));


app.get('/', (_req, res) => {
  res.send('Hello World');  
});

const auth = require("./routes/auth.routes");
app.use("/auth", auth);

const contacts = require("./routes/contact.routes");
app.use("/api", contacts);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;
