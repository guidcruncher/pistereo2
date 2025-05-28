#!/bin/bash

if [ -z "$NODE_ENV" ]; then
  NODE_ENV=development
fi
echo "Running for $NODE_ENV"

if [ -f "../config/.env" ]; then
cp ../config/.env ./build/server
fi

cd ./build/mediaserver/mpv/

. mpv.sh
