#!/bin/bash

if [ ! -d "node_modules" ]; then
  echo "Installing build tools."
  npm i --prefer-offline --no-audit --progress=false >/dev/null 2>&1
  npm install -g grunt-cli --prefer-offline --no-audit --progress=false >/dev/null 2>&1
fi

if [ -z "$1" ]; then
   buildenv=development
else
  if [ "$1" == "dev" ]; then
    buildenv=development
  fi

  if [ "$1" == "prod" ]; then
    buildenv=production
  fi
fi

env NODE_ENV="$buildenv" grunt
