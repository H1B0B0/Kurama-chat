import { expect } from "chai";
import { Room } from "../models/room";

describe("Room Model", () => {
  describe("Instantiation", () => {
    it("should create a new Room object", () => {
      const data = {
        _id: "1",
        name: "Global Chatroom",
        userId: "user123"
      };

      const room = new Room(data);

      expect(room._id).to.equal(data._id);
      expect(room.name).to.equal(data.name);
      expect(room.userId).to.equal(data.userId);
    });
  });
});
