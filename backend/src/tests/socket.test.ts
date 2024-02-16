import { expect } from "chai";
import { Message } from "../models/messages";

describe("Socket Routes", () => {
  describe("Message", () => {
    it("should create a new message object", () => {
      const data = {
        text: "Hello, world!",
        name: "John Doe",
        id: "123",
        socketId: "abc",
        roomId: "456",
        image: "image.jpg",
        userId: "789",
        date: new Date(),
        systemMessage: false,
      };

      const message = new Message(data);

      expect(message.text).to.equal(data.text);
      expect(message.name).to.equal(data.name);
      expect(message.id).to.equal(data.id);
      expect(message.socketId).to.equal(data.socketId);
      expect(message.roomId).to.equal(data.roomId);
      expect(message.image).to.equal(data.image);
      expect(message.userId).to.equal(data.userId);
      expect(message.date).to.equal(data.date);
      expect(message.systemMessage).to.equal(data.systemMessage);
    });
  });
});
