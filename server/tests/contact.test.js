const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../models/User");
const Contact = require("../models/Contacts");

let token;
let userId;
let contactId;

beforeAll(async () => {
  const testDbUrl = process.env.URL_ATLAS || "mongodb://localhost:27017/mycontacts_test";
  await mongoose.connect(testDbUrl);
});

beforeEach(async () => {
  await User.deleteMany({});
  await Contact.deleteMany({});

  await request(app)
    .post("/auth/register")
    .send({ 
      email: "contacttest@example.com", 
      password: "password123" 
    });

  const loginRes = await request(app)
    .post("/auth/login")
    .send({ 
      email: "contacttest@example.com", 
      password: "password123" 
    });

  token = loginRes.body.accessToken;
  userId = loginRes.body.user.id;
});

afterAll(async () => {
  await User.deleteMany({});
  await Contact.deleteMany({});
  await mongoose.connection.close();
});

describe("Contact API", () => {
  describe("GET /api/contacts", () => {
    it("should get all contacts for authenticated user", async () => {
      const res = await request(app)
        .get("/api/contacts")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("should return empty array when user has no contacts", async () => {
      const res = await request(app)
        .get("/api/contacts")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);
    });

    it("should not get contacts without authentication", async () => {
      const res = await request(app)
        .get("/api/contacts");

      expect(res.statusCode).toBe(401);
    });

    it("should not get contacts with invalid token", async () => {
      const res = await request(app)
        .get("/api/contacts")
        .set("Authorization", "Bearer invalidtoken123");

      expect(res.statusCode).toBe(401);
    });
  });

  describe("POST /api/contacts", () => {
    it("should create a new contact successfully", async () => {
      const newContact = {
        firstName: "John",
        lastName: "Doe",
        phone: "1234567890"
      };

      const res = await request(app)
        .post("/api/contacts")
        .set("Authorization", `Bearer ${token}`)
        .send(newContact);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("firstName", "John");
      expect(res.body).toHaveProperty("lastName", "Doe");
      expect(res.body).toHaveProperty("phone", "1234567890");
      expect(res.body).toHaveProperty("userId");

      contactId = res.body._id;
    });

    it("should not create contact without firstName", async () => {
      const res = await request(app)
        .post("/api/contacts")
        .set("Authorization", `Bearer ${token}`)
        .send({
          lastName: "Doe",
          phone: "1234567890"
        });

      expect(res.statusCode).toBe(400);
    });

    it("should not create contact without lastName", async () => {
      const res = await request(app)
        .post("/api/contacts")
        .set("Authorization", `Bearer ${token}`)
        .send({
          firstName: "John",
          phone: "1234567890"
        });

      expect(res.statusCode).toBe(400);
    });

    it("should not create contact without phone", async () => {
      const res = await request(app)
        .post("/api/contacts")
        .set("Authorization", `Bearer ${token}`)
        .send({
          firstName: "John",
          lastName: "Doe"
        });

      expect(res.statusCode).toBe(400);
    });

    it("should not create contact with phone less than 10 characters", async () => {
      const res = await request(app)
        .post("/api/contacts")
        .set("Authorization", `Bearer ${token}`)
        .send({
          firstName: "John",
          lastName: "Doe",
          phone: "123"
        });

      expect(res.statusCode).toBe(400);
    });

    it("should not create contact without authentication", async () => {
      const res = await request(app)
        .post("/api/contacts")
        .send({
          firstName: "John",
          lastName: "Doe",
          phone: "1234567890"
        });

      expect(res.statusCode).toBe(401);
    });
  });

  describe("PUT /api/contacts/:id", () => {
    beforeEach(async () => {
      const createRes = await request(app)
        .post("/api/contacts")
        .set("Authorization", `Bearer ${token}`)
        .send({
          firstName: "Jane",
          lastName: "Smith",
          phone: "9876543210"
        });

      contactId = createRes.body._id;
    });

    it("should update an existing contact successfully", async () => {
      const updatedData = {
        firstName: "Jane Updated",
        lastName: "Smith Updated",
        phone: "1111111111"
      };

      const res = await request(app)
        .put(`/api/contacts/${contactId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updatedData);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("firstName", "Jane Updated");
      expect(res.body).toHaveProperty("lastName", "Smith Updated");
      expect(res.body).toHaveProperty("phone", "1111111111");
    });

    it("should update only firstName", async () => {
      const res = await request(app)
        .put(`/api/contacts/${contactId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          firstName: "UpdatedFirstName"
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("firstName", "UpdatedFirstName");
      expect(res.body).toHaveProperty("lastName", "Smith");
    });

    it("should not update contact with invalid phone", async () => {
      const res = await request(app)
        .put(`/api/contacts/${contactId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          phone: "123"
        });

      expect(res.statusCode).toBe(400);
    });

    it("should not update non-existent contact", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/contacts/${fakeId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          firstName: "Test"
        });

      expect(res.statusCode).toBe(404);
    });

    it("should not update contact without authentication", async () => {
      const res = await request(app)
        .put(`/api/contacts/${contactId}`)
        .send({
          firstName: "Test"
        });

      expect(res.statusCode).toBe(401);
    });

    it("should not update another user's contact", async () => {
      await request(app)
        .post("/auth/register")
        .send({ 
          email: "anotheruser@example.com", 
          password: "password123" 
        });

      const loginRes = await request(app)
        .post("/auth/login")
        .send({ 
          email: "anotheruser@example.com", 
          password: "password123" 
        });

      const anotherToken = loginRes.body.accessToken;

      const res = await request(app)
        .put(`/api/contacts/${contactId}`)
        .set("Authorization", `Bearer ${anotherToken}`)
        .send({
          firstName: "Hacked"
        });

      expect(res.statusCode).toBe(404);
    });
  });

  describe("DELETE /api/contacts/:id", () => {
    beforeEach(async () => {
      const createRes = await request(app)
        .post("/api/contacts")
        .set("Authorization", `Bearer ${token}`)
        .send({
          firstName: "ToDelete",
          lastName: "Contact",
          phone: "5555555555"
        });

      contactId = createRes.body._id;
    });

    it("should delete an existing contact successfully", async () => {
      const res = await request(app)
        .delete(`/api/contacts/${contactId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message");

      const getRes = await request(app)
        .get("/api/contacts")
        .set("Authorization", `Bearer ${token}`);

      expect(getRes.body.length).toBe(0);
    });

    it("should not delete non-existent contact", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .delete(`/api/contacts/${fakeId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
    });

    it("should not delete contact without authentication", async () => {
      const res = await request(app)
        .delete(`/api/contacts/${contactId}`);

      expect(res.statusCode).toBe(401);
    });

    it("should not delete another user's contact", async () => {
      await request(app)
        .post("/auth/register")
        .send({ 
          email: "deletetest@example.com", 
          password: "password123" 
        });

      const loginRes = await request(app)
        .post("/auth/login")
        .send({ 
          email: "deletetest@example.com", 
          password: "password123" 
        });

      const anotherToken = loginRes.body.accessToken;

      const res = await request(app)
        .delete(`/api/contacts/${contactId}`)
        .set("Authorization", `Bearer ${anotherToken}`);

      expect(res.statusCode).toBe(404);
    });
  });

  describe("Integration: Full CRUD Flow", () => {
    it("should perform complete CRUD operations", async () => {
      const createRes = await request(app)
        .post("/api/contacts")
        .set("Authorization", `Bearer ${token}`)
        .send({
          firstName: "Integration",
          lastName: "Test",
          phone: "9999999999"
        });

      expect(createRes.statusCode).toBe(201);
      const createdId = createRes.body._id;

      const getAllRes = await request(app)
        .get("/api/contacts")
        .set("Authorization", `Bearer ${token}`);

      expect(getAllRes.statusCode).toBe(200);
      expect(getAllRes.body.length).toBe(1);
      expect(getAllRes.body[0]).toHaveProperty("firstName", "Integration");

      const updateRes = await request(app)
        .put(`/api/contacts/${createdId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          firstName: "Updated Integration",
          lastName: "Updated Test",
          phone: "8888888888"
        });

      expect(updateRes.statusCode).toBe(200);
      expect(updateRes.body).toHaveProperty("firstName", "Updated Integration");

      const deleteRes = await request(app)
        .delete(`/api/contacts/${createdId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(deleteRes.statusCode).toBe(200);

      const finalGetRes = await request(app)
        .get("/api/contacts")
        .set("Authorization", `Bearer ${token}`);

      expect(finalGetRes.body.length).toBe(0);
    });
  });
});