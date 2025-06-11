#!/bin/bash
# Pulseaudio
rm -rf /var/run/pulse /var/lib/pulse /root/.config/pulse

# Start pulseaudio as system wide daemon; for debugging it helps to start in non-daemon mode
pulseaudio -D --verbose --exit-idle-time=-1 --system --disallow-exit


pm2 link kv17v06555e5fft ioy5vykidakic2w

ln -sf /usr/share/zoneinfo/$TZ /etc/localtime 
echo $TZ > /etc/timezone

cd /app
cp /streams-base/* /streams/


if [ -f "/config/configuration.env" ]; then
   cat /config/configuration.env >  ./server/.env
fi

if [ -f "/config/.env" ]; then
  cat /config/.env >  ./server/.env
fi

if [ -f "./server/.env" ]; then
  dotenv -o -e ./server/.env -- pm2 start ./ecosystem.config.js --env $NODE_ENV
else
  pm2 start ./ecosystem.config.js --env $NODE_ENV
fi

pm2 logs
