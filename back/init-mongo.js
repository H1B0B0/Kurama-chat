db.createUser({
  user: process.env.MONGODB_USER,
  pwd: process.env.MONGODB_USER_PASSWORD,
  roles: [{ role: "readWrite", db: process.env.MONGO_INITDB_DATABASE }],
});

db.createCollection("messages", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["messages"],
      properties: {
        // conversationId: {
        //   bsonType: "objectId",
        // },
        messages: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["timestamp", "content"],
            properties: {
              timestamp: {
                bsonType: "date",
              },
              content: {
                bsonType: "string",
              },
            },
          },
        },
      },
    },
  },
});

db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id", "username", "password"],
      properties: {
        id: {
          bsonType: "objectId",
        },
        username: {
          bsonType: "string",
        },
        password: {
          bsonType: "string",
        },
      },
    },
  },
});
