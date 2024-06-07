import * as chai from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import app from "../app.js"; // Importa tu aplicación Express aquí

const { expect } = chai;
const request = supertest(app);

describe("Product API Testing", () => {
  before(async () => {
    await mongoose.connect(
      "mongodb+srv://daviddgatto:12345@coderdb.bnklr4n.mongodb.net/ecommerce?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      }
    );
  });

  after(async () => {
    await mongoose.disconnect();
  });

  describe("GET /api/products/:pid", () => {
    it("should get a product by ID", async () => {
      const productId = "665883dcb88804ae49f16837";
      const response = await request.get(`/api/products/${productId}`);
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("title");
      expect(response.body).to.have.property("description");
    });

    it("should return 404 for non-existent product ID", async () => {
      const nonExistentProductId = "665233dcb88804ae49f16837";
      const response = await request.get(
        `/api/products/${nonExistentProductId}`
      );
      expect(response.status).to.equal(404);
      expect(response.body).to.have.property(
        "message",
        `A product with the id ${nonExistentProductId} was not found`
      );
    });
  });

  describe("POST /api/products", () => {
    it("should add a new product", async () => {
      const newProduct = {
        title: "Laptop",
        description: "A high performance laptop",
        price: 1500,
        code: "laptop123",
        stock: 30,
        category: "electronics",
        status: true,
        thumbnails: ["image1.jpg", "image2.jpg"],
      };
      const response = await request.post("/api/products").send(newProduct);
      expect(response.status).to.equal(201);
      expect(response.body).to.have.property(
        "message",
        "Producto agregado correctamente"
      );
      expect(response.body.product).to.include(newProduct);
    });
  });

  describe("POST /api/carts", () => {
    it("should create a new cart", async () => {
      const response = await request.post("/api/carts");
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("_id");
    });
  });

  describe("GET /api/carts/:cid", () => {
    it("should get a cart by ID", async () => {
      const cartId = "65c1a95b1a1295c109f481b4";
      const response = await request.get(`/api/carts/${cartId}`);
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("_id", cartId);
    });
  });
});
