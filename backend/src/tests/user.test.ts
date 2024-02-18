import { expect } from "chai";
import sinon from "sinon";
import { User } from "../models/user.js";

describe("User Model", () => {
  describe("Instantiation", () => {
    it("should create a new User object", () => {
      const data = {
        username: "testuser",
        email: "testuser@example.com",
        password: "password123",
        userId: "userid123",
      };

      const user = new User(data);

      expect(user).to.have.property("username", data.username);
      expect(user).to.have.property("email", data.email);
      expect(user).to.have.property("password", data.password);
      expect(user).to.have.property("userId", data.userId);
      expect(user).to.have.property("createdAt").that.is.an.instanceof(Date);
    });
  });

  describe("Static Methods", () => {
    it("should return all user objects", async () => {
      // Create a stub for the User.findAll method
      const stub = sinon.stub(User, "findAll");
      // Make the stub return a Promise that resolves to an array
      stub.resolves([]);

      const users = await User.findAll();

      // Make sure the stub was called
      sinon.assert.calledOnce(stub);

      expect(users).to.be.an("array");

      // Restore the original method
      stub.restore();
    });
  });
});
