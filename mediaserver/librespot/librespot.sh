#!/bin/bash
mkdir -p $PISTEREO_CONFIG/librespot

dotenv -o -e $PISTEREO_CONFIG/.env -- envsubst < ./config-template-zeroconf.yml > $PISTEREO_CONFIG/librespot/config.yml

./go-librespot --config_dir $PISTEREO_CONFIG/librespot/

