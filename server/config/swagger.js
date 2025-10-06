const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MyContacts API",
      version: "1.0.0",
      description: "API documentation for authentication and contacts management",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
      },
    ],
  },
  apis: ["./routes/auth.routes.js", "./routes/contact.routes.js"], 
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
