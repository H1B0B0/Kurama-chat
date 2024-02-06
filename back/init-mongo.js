db.createUser({
  user: process.env.MONGODB_USER,
  pwd: process.env.MONGODB_USER_PASSWORD,
  roles: [{ role: "readWrite", db: process.env.MONGO_INITDB_DATABASE }],
});
