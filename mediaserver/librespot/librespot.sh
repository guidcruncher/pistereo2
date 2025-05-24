#!/bin/bash
mkdir -p $PISTEREO_CONFIG/librespot

if [ "$PISTEREO_LIBRESPOT_MODE" == "zeroconf" ]; then
  dotenv -o -e ../../api/.env -- envsubst < ./config-template-zeroconf.yml > $PISTEREO_CONFIG/librespot/config.yml

  ./go-librespot --config_dir $PISTEREO_CONFIG/librespot/
else
if [ -f "$PISTEREO_CONFIG/librespot/accesstoken.env" ]; then
  dotenv -o -e $PISTEREO_CONFIG/librespot/accesstoken.env -e ../../api/.env -- envsubst < ./config-template-token.yml > $PISTEREO_CONFIG/librespot/config.yml

  ./go-librespot --config_dir $PISTEREO_CONFIG/librespot/
fi
fi

