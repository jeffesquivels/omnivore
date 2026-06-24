#!/bin/bash

#psql $PG_STRING --command "CREATE DATABASE $PG_DB;" || true
#echo "create $PG_DB database"

#psql $PG_STRING --command "CREATE USER app_user WITH ENCRYPTED PASSWORD '$PG_PASSWORD';" || true
#echo "created app_user"

#psql --host $PG_HOST --username $POSTGRES_USER --command "CREATE USER replicator WITH REPLICATION ENCRYPTED PASSWORD 'replicator_password';" || true
#echo "created replicator"

#psql --host $PG_HOST --username $POSTGRES_USER --command "SELECT pg_create_physical_replication_slot('replication_slot');" || true
#echo "created replication_slot"

yarn workspace @omnivore/db migrate

psql $PG_STRING --command "GRANT omnivore_user TO app_user;" || true
echo "granted omnivore_user to app_user"

# create demo user with email: demo@omnivore.app, password: demo_password
if [ -z "${NO_DEMO_USER}" ]; then
    USER_ID=$(uuidgen)
    PASSWORD=''
    psql $PG_STRING --command " ;"
    echo "created demo user with email: demo@omnivore.app, password: demo_password"
fi
