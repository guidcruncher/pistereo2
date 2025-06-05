 #!/bin/bash

dotenv -o -e $PISTEREO_CONFIG/.env -- mpv -v --alsa-mixer-device="$PISTEREO_ALSA_DEVICE" --no-video --keep-open=yes --input-ipc-server="$PISTEREO_MPV_SOCKET" --idle=yes --display-tags-clr --msg-level=cplayer=error --no-terminal --really-quiet --stream-buffer-size=$PISTEREO_STREAM_BUFFER_SIZE --cache=no 2&>1 1>/dev/null
