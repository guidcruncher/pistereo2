#!/bin/bash
arch="$(uname -m)"
if [ == "aarch64" ]; then
docker buildx build -f ./dockerfiles/Dockerfile-bullseye -t guidcruncher/pistereo2:bullseye-latest -t guidcruncher/pistereo2:latest --pull --push .

# docker buildx build -f ./dockerfiles/Dockerfile-alpine -t guidcruncher/pistereo2:alpine-latest --pull --push .

# docker buildx build -f ./dockerfiles/Dockerfile-mediaserver -t guidcruncher/pistereo2:mediaserver --pull --push .
else
docker buildx build -f ./dockerfiles/Dockerfile-bullseye -t guidcruncher/pistereo2:bullseye-latest -t guidcruncher/pistereo2:latest --platform linux/arm64 --pull --push .

# docker buildx build -f ./dockerfiles/Dockerfile-alpine -t guidcruncher/pistereo2:alpine-latest --pull --push --platform linux/arm64 .

# docker buildx build -f ./dockerfiles/Dockerfile-mediaserver -t guidcruncher/pistereo2:mediaserver --pull --push --platform linux/arm64 .

fi
