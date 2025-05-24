#!/bin/bash

if [ -z "$NODE_ENV" ]; then
  NODE_ENV=development
fi
echo "Running for $NODE_ENV"

if [ -f "./config/.env" ]; then
  cp ./config/.env ./build/server/.env
fi

if [ -f "./media.env" ]; then
  cat ./media.env | sed "s@PISTEREO_MPV_SOCKET=/config/mpv/socket@PISTEREO_MPV_SOCKET=$HOME/src/pistereo-config/mpv/socket@g" > ./build/server/.env
fi

cd ./build/server
node ./main.js

