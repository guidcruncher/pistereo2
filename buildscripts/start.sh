#!/bin/bash


basedir="./build/server"
cp ./server/configuration.env ./build/server/

if [ "$IN_DOCKER" == "yes" ]; then
  basedir="/app/server"
fi


if [ -z "$NODE_ENV" ]; then
  NODE_ENV=development
fi
echo "Running for $NODE_ENV"

if [ -f "./config/.env" ]; then
  cp ./config/.env "$basedir"/.env
fi

if [ -f "./media.env" ]; then
  cat ./media.env | sed "s@PISTEREO_MPV_SOCKET=/config/mpv/socket@PISTEREO_MPV_SOCKET=$HOME/src/pistereo-config/mpv/socket@g" > "$basedir"/.env
fi

cd "$basedir"
dotenv -e ./configuration.env -- node ./main.js
