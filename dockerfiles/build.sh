#!/bin/bash
arch="$(uname -m)"

if [ "$arch" == "aarch64" ]; then
docker buildx build -f ./dockerfiles/Dockerfile -t guidcruncher/pistereo2:latest --pull --push .
else
docker buildx build -f ./dockerfiles/Dockerfile -t guidcruncher/pistereo2:latest --platform linux/arm64 --pull --push .
fi
