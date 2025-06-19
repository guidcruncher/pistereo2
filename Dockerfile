FROM --platform=linux/arm64 node:bookworm-slim AS base
ARG DEBIAN_FRONTEND=noninteractive
ENV NODE_ENV=production
ARG TARGETARCH
ENV TZ=UTC

RUN <<EOF
apt update
apt install -y --no-install-recommends tzdata ca-certificates gettext nginx

apt clean -y > /dev/null
rm -rf /var/cache/apt/archives /var/lib/apt/lists

ln -sf /usr/share/zoneinfo/$TZ /etc/localtime

npm config set fund false
npm i -g @nestjs/cli dotenv-cli forever --no-audit
echo $TZ > /etc/timezone
npm cache clean --force
mkdir -p /cache /config /app/server /app/client
EOF

COPY ./nginx.conf /etc/nginx/sites-enabled/default
COPY ./startcontainer.sh /app/startcontainer.sh
RUN chmod +x /app/startcontainer.sh

FROM base AS build

RUN mkdir /build
ADD ./client/ /client
ADD ./server/ /server

WORKDIR /client
RUN <<EOF
npm i --no-audit --include=dev
npm run build
EOF

WORKDIR /server
RUN <<EOF
npm i --no-audit  --include=dev
npm run build
npm prune --production
cd /build/server
cp /server/node_modules ./ -r
EOF

FROM base AS production
COPY --from=build /build/client/ /app/client/
COPY --from=build /build/server/ /app/server/

ENV NODE_ENV=production
ENV TZ=UTC
ENV PISTEREO_LISTEN_PORT=3000
ENV PISTEREO_MONGO_URL=""
ENV PISTEREO_MONGO_DB=pistereo2
ENV PISTEREO_CACHE=/cache
ENV PISTEREO_CONFIG=/config
ENV IN_DOCKER="yes"

ENTRYPOINT [ "/bin/sh", "-E", "-c" ]
CMD ["/app/startcontainer.sh"]
