#!/bin/bash

cd ./server

if [ ! -d "node_modules" ]; then
  echo "Installing dependencies."
  npm i --prefer-offline --no-audit --progress=false
fi

npm run lint 

cd ../client

if [ ! -d "node_modules" ]; then
  echo "Installing dependencies."
  npm i --prefer-offline --no-audit --progress=false
fi

npm run lint 
