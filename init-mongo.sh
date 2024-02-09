#!/bin/bash
set -e

mongo <<EOF
use $MONGO_INITDB_DATABASE
db.createUser({
  user:  "$MONGODB_USER",
  pwd: "$MONGODB_USER_PASSWORD",
  roles: [{
    role: "readWrite",
    db: "$MONGO_INITDB_DATABASE"
  }]
})
EOF