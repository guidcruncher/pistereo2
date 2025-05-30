#!/bin/bash
docker buildx build -f Dockerfile-bullseye -t guidcruncher/pistereo2:bullseye-latest --pull --push .

docker buildx build -f Dockerfile -t guidcruncher/pistereo2:latest --pull --push .

docker buildx build -f Dockerfile-media -t guidcruncher/pistereo2:mediaserver --pull --push .

