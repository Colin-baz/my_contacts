require("dotenv").config();
const express = require('express');
const connectDB = require("./config/db");

const app = express();

app.use(express.json());

const auth = require("./routes/auth.routes");
app.use("/auth", auth);
const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();

app.get('/', (_req, res) => {
  res.send('Hello World');  
});
