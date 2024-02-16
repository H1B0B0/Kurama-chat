#!/bin/bash
set -e

until mongo --eval "print(\"waited for connection\")"
do
        sleep 1
done

mongo <<EOF
use $MONGO_INITDB_DATABASE
db.createUser({
    user: "$MONGODB_USER",
    pwd: "$MONGODB_USER_PASSWORD",
    roles: [{
        role: "readWrite",
        db: "$MONGO_INITDB_DATABASE"
    }]
})
EOF