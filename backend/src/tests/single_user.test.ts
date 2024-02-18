import { expect } from "chai";
import { SingleUser } from "../models/single_user";

describe("SingleUser Model", () => {
  describe("Instantiation", () => {
    it("should create a new SingleUser object", () => {
      const data = {
        username: "testuser",
        socketId: "socket123"
      };

      const singleUser = new SingleUser(data);

      expect(singleUser.username).to.equal(data.username);
      expect(singleUser.socketId).to.equal(data.socketId);
    });
  });

    describe("Static Methods", () => {
        it("should return all single user objects", async () => {
            const users = await SingleUser.findAll();
            expect(users).to.be.an('array');
        });

        it("should find a single user by socketId", async () => {
            const user = await SingleUser.findOneByUsername('socket123');
            expect(user).to.be.an('object');
            expect(user?.socketId).to.equal('socket123');
        });
    });
});
