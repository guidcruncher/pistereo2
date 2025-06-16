FROM --platform=linux/arm64 node:bookworm-slim AS base
ARG DEBIAN_FRONTEND=noninteractive
ENV NODE_ENV=production
ARG TARGETARCH
ENV TZ=UTC

RUN <<EOF
 apt update > /dev/null
 apt install -y curl jq gettext tzdata ca-certificates > /dev/null
 apt clean -y > /dev/null
 rm -rf /var/cache/apt/archives /var/lib/apt/lists
 ln -sf /usr/share/zoneinfo/$TZ /etc/localtime
 echo $TZ > /etc/timezone

 npm i -g @nestjs/cli grunt-cli dotenv-cli --no-audit
 npm cache clean --force
EOF

FROM base AS build
WORKDIR /src
RUN mkdir -p build

COPY . .
RUN <<EOF
 chmod +x ./buildscripts/*.sh
 npm i --no-audit --progress=false
 cd server
 npm i --no-audit --progress=false
 cd ../client
 npm i --no-audit --progress=false

 grunt build-all
EOF

COPY ./buildscripts/startcontainer.sh ./build/startcontainer.sh
COPY ./buildscripts/start.sh ./build/server/start.sh
RUN  chmod +x ./build/*.sh ./build/server/*.sh

FROM base AS production
ENV NODE_ENV=production
ENV TZ=UTC
RUN npm config set fund false
RUN ln -sf /usr/share/zoneinfo/$TZ /etc/localtime
RUN echo $TZ > /etc/timezone
RUN mkdir -p /config

WORKDIR /app
COPY --from=build /src/build .
COPY --from=build /src/config /config

ENV PISTEREO_CLIENTID=""
ENV PISTEREO_REMOTEDEVICE="Your Stereo"
ENV PISTEREO_LOCALDEVICE="Your Device"
ENV PISTEREO_LISTEN_PORT=3001
ENV PISTEREO_MONGO_URL=""
ENV PISTEREO_MONGO_DB=pistereo2
ENV PISTEREO_CACHE=/cache
ENV PISTEREO_CONFIG=/config
ENV IN_DOCKER="yes"
ENV PISTEREO_EQ_RESET=60

ENTRYPOINT [ "/bin/sh", "-E", "-c" ]
CMD ["/app/startcontainer.sh"]
