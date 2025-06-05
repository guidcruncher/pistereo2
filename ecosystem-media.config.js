
module.exports = {
  apps : [
  {
    name   : "Librespot",
    cwd    : "/app/mediaserver/librespot",
    script : "librespot.sh",
    env_production: {
    },
    env_development: {
    }
  },
  {
    name   : "MPV",
    cwd    : "/app/mediaserver/mpv",
    script : "mpv.sh",
    env_production: {
    },
    env_development: {
    }
  },
  ]
}

