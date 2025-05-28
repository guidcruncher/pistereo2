#!/bin/bash

if [ -z "$TARGETARCH" ]; then
  TARGETARCH="$(uname -m)"
  if [ "$TARGETARCH" = "aarch64" ]; then
    TARGETARCH="arm64"
  fi

fi

echo "Looking for go-librespot_linux_$TARGETARCH.tar.gz"

DOWNLOAD_URL=$(curl -s \
  https://api.github.com/repos/devgianlu/go-librespot/releases/latest | \
  jq '.assets[].browser_download_url' -r | \
  grep "go-librespot_linux_$TARGETARCH.tar.gz" \
  )

if [ -z "$DOWNLOAD_URL" ]; then
  echo "Unable to determime download url for arch $TARGETARCH"
  exit 1
else
  echo "Downloading from $DOWNLOAD_URL"
  curl -s -L "$DOWNLOAD_URL" -o ./librespot.tar.gz 2>/dev/null
  res="$?"

  if [ "$res" == "0" ]; then
    if [ -f "./librespot.tar.gz" ]; then
      if [ -f "./go-librespot" ]; then
        rm ./go-librespot
      fi

      tar xvf ./librespot.tar.gz go-librespot
      chmod +x go-librespot
      rm ./librespot.tar.gz
    else
      echo "An error occured, download file not found."
      exit 1
   fi
  else
    echo "An error occured during download, curl exited with code $res"
    exit 1
  fi
fi
