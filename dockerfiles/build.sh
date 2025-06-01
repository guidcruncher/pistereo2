#!/bin/bash

docker buildx build -f ./dockerfiles/Dockerfile-bullseye -t guidcruncher/pistereo2:bullseye-latest -t guidcruncher/pistereo2:latest --pull --push .

# docker buildx build -f ./dockerfiles/Dockerfile-alpine -t guidcruncher/pistereo2:alpine-latest --pull --push .

docker buildx build -f ./dockerfiles/Dockerfile-mediaserver -t guidcruncher/pistereo2:mediaserver --pull --push .

