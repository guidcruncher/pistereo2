#!/bin/bash
if [ -z "$NODE_ENV" ]; then
  NODE_ENV=development
fi

echo "Building for $NODE_ENV"

cd ./client

if [ ! -d "node_modules" ]; then
  echo "Installing dependencies."
  npm i --prefer-offline --no-audit --progress=false
fi

npm run build
