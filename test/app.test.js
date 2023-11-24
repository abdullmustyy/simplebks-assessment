import { expect } from "chai";
import supertest from "supertest";
import { app } from "../app.js";
import "dotenv/config";

// Get username and password from .env file
const { USER_NAME, PASSWORD } = process.env;
// Connect app with supertest
const request = supertest(app);

describe("Simplebks Job Assessment", () => {
  // Test the base route
  describe("Base route", () => {
    it("should return a string", async () => {
      const res = await request
        .get("/")
        .set(
          "Authorization",
          `Basic ${Buffer.from(`${USER_NAME}:${PASSWORD}`).toString("base64")}}`
        );
      expect(res.text)
        .to.be.a("string")
        .to.equal(
          "<a href='https://simplebks.com/' target='_blanck'>Simplebks</a> Job Assessment, hire me :)"
        );
    });
  });
  // Test /order_items route
  describe("Get seller order items", () => {
    it("should get order items of the currently logged in seller", async () => {
      const res = await request
        .get("/order_items")
        .set(
          "Authorization",
          `Basic ${Buffer.from(`${USER_NAME}:${PASSWORD}`).toString("base64")}}`
        );
      expect(res.headers["content-type"]).to.match(/json/);
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("object");
      expect(res.body.success).to.be.true;
      expect(res.body.message).to.be.a("string");
      expect(res.body.data).to.be.an("array");
      expect(res.body.total).to.be.a("number");
      expect(res.body.limit).to.be.a("number");
      expect(res.body.offset).to.be.a("number");
    });
  });
  // Test /order_items/:id route
  describe("Delete order item", () => {
    it("should delete an order item with the given id", async () => {
      const res = await request
        .delete("/order_items/1")
        .set(
          "Authorization",
          `Basic ${Buffer.from(`${USER_NAME}:${PASSWORD}`).toString("base64")}}`
        );
      expect(res.headers["content-type"]).to.match(/json/);
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("object");
      expect(res.body.success).to.be.true;
      expect(res.body.message).to.be.a("string");
    });
  });
  // Test /account route
  describe("Update account", () => {
    it("should update the currently logged in seller's account", async () => {
      const res = await request
        .patch("/account")
        .set(
          "Authorization",
          `Basic ${Buffer.from(`${USER_NAME}:${PASSWORD}`).toString("base64")}}`
        )
        .send({ city: "New York", state: "NY" });
      expect(res.headers["content-type"]).to.match(/json/);
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("object");
      expect(res.body.success).to.be.true;
      expect(res.body.data).to.be.an("object");
      expect(res.body.data.seller_city).to.be.a("string");
      expect(res.body.data.seller_state).to.be.a("string");
    });
  });
});
