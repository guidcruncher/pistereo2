#!/bin/sh
export PISTEREO_CLIENTSECRET=""
configfilename="$PISTEREO_CONFIG"/configuration.env

ln -sf /usr/share/zoneinfo/$TZ /etc/localtime 
echo $TZ > /etc/timezone

if [ -f "/run/secrets/PISTEREO_CLIENTSECRET" ]; then
  export PISTEREO_CLIENTSECRET="$(cat /run/secrets/PISTEREO_CLIENTSECRET)"
fi

cd /app/server

if [ -f "$configfilename" ]; then
  dotenv -o -e "$configfilename" -- node ./nain,js
else
  node ./nain,js
fi
