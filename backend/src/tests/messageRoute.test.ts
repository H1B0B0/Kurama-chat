import request from "supertest";
import express from "express";
import { expect } from "chai";
import sinon from "sinon";
import { router as messageRoutes } from "../routes/messageRoutes.js";
import { Message } from "../models/messages.js";

const app = express();
app.use(express.json());
app.use("/messages", messageRoutes);

describe("GET /messages", () => {
  it("should fetch all messages", async () => {
    const mockMessages = [{ _id: "1", text: "Test message", roomId: "1" }];
    sinon.stub(Message, "find").resolves(mockMessages);

    const res = await request(app).get("/messages");
    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal(mockMessages);

    sinon.restore();
  });
});

describe("GET /messages/:roomId", () => {
  it("should fetch all messages for a specific room", async () => {
    const mockMessages = [{ _id: "1", text: "Test message", roomId: "1" }];
    sinon.stub(Message, "find").resolves(mockMessages);

    const res = await request(app).get("/messages/1");
    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal(mockMessages);

    sinon.restore();
  });
});
