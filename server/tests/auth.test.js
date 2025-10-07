const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../models/User");

// Connect to test database before running tests
beforeAll(async () => {
  const testDbUrl = process.env.URL_ATLAS || "mongodb://localhost:27017/mycontacts_test";
  await mongoose.connect(testDbUrl);
});

// Clean up database after each test
afterEach(async () => {
  await User.deleteMany({});
});

// Close database connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe("Auth API", () => {
  describe("POST /auth/register", () => {
    it("should register a new user successfully", async () => {
      const res = await request(app)
        .post("/auth/register")
        .send({
          email: "test@example.com",
          password: "password123"
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("message", "User created successfully");
      expect(res.body).toHaveProperty("user");
      expect(res.body.user).toHaveProperty("email", "test@example.com");
      expect(res.body.user).toHaveProperty("id");
    });

    it("should not register a user with duplicate email", async () => {
      // First registration
      await request(app)
        .post("/auth/register")
        .send({
          email: "duplicate@example.com",
          password: "password123"
        });

      // Try to register again with same email
      const res = await request(app)
        .post("/auth/register")
        .send({
          email: "duplicate@example.com",
          password: "password456"
        });

      expect(res.statusCode).toBe(400);
    });

    it("should not register a user without email", async () => {
      const res = await request(app)
        .post("/auth/register")
        .send({
          password: "password123"
        });

      expect(res.statusCode).toBe(412);
      expect(res.body).toHaveProperty("success", false);
    });

    it("should not register a user without password", async () => {
      const res = await request(app)
        .post("/auth/register")
        .send({
          email: "test@example.com"
        });

      expect(res.statusCode).toBe(412);
      expect(res.body).toHaveProperty("success", false);
    });
  });

  describe("POST /auth/login", () => {
    beforeEach(async () => {
      // Register a user before each login test
      await request(app)
        .post("/auth/register")
        .send({
          email: "logintest@example.com",
          password: "password123"
        });
    });

    it("should login an existing user successfully", async () => {
      const res = await request(app)
        .post("/auth/login")
        .send({
          email: "logintest@example.com",
          password: "password123"
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("message", "Login successful");
      expect(res.body).toHaveProperty("accessToken");
      expect(res.body).toHaveProperty("user");
      expect(res.body.user).toHaveProperty("email", "logintest@example.com");
      expect(typeof res.body.accessToken).toBe("string");
    });

    it("should not login with incorrect password", async () => {
      const res = await request(app)
        .post("/auth/login")
        .send({
          email: "logintest@example.com",
          password: "wrongpassword"
        });

      expect(res.statusCode).toBe(401);
    });

    it("should not login with non-existent email", async () => {
      const res = await request(app)
        .post("/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: "password123"
        });

      expect(res.statusCode).toBe(401);
    });

    it("should not login without email", async () => {
      const res = await request(app)
        .post("/auth/login")
        .send({
          password: "password123"
        });

      expect(res.statusCode).toBe(412);
      expect(res.body).toHaveProperty("success", false);
    });

    it("should not login without password", async () => {
      const res = await request(app)
        .post("/auth/login")
        .send({
          email: "logintest@example.com"
        });

      expect(res.statusCode).toBe(412);
      expect(res.body).toHaveProperty("success", false);
    });
  });
});