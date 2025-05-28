#!/bin/bash

if [ -z "$NODE_ENV" ]; then
  NODE_ENV=development
fi

echo "Building for $NODE_ENV"

cd ./server

if [ ! -d "node_modules" ]; then
  echo "Installing dependencies."
  npm i --prefer-offline --no-audit --progress=false
fi

npm run build
res="$?"

if [ "$res" == "0" ]; then
  echo "Deploying dependencies"
  cp ../buildscripts/startcontainer.sh ../build/
  cp ../ecosystem.config.js ../build/
  chmod +x ../build/*.sh
  cp package* ../build/server
  cd ../build/server
  npm ci --prefer-offline --no-audit --progress=false > /dev/null 2>&1
  echo "$(date)" > ../.restart
  echo "Finished."
else
  exit "$res"
fi
