require("dotenv").config();
const express = require('express');
const connectDB = require("./config/db");
const { swaggerUi, specs } = require("./config/swagger");


const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));


app.get('/', (_req, res) => {
  res.send('Hello World');  
});

const auth = require("./routes/auth.routes");
app.use("/auth", auth);

const contacts = require("./routes/contact.routes");
app.use("/api", contacts);

const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();



