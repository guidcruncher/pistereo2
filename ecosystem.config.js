
module.exports = {
  apps : [
  {
    name   : "Server",
    cwd    : "/app/server",
    script : "start.sh",
    env_production: {
       NODE_ENV: "production",
    },
    env_development: {
       NODE_ENV: "development",
    }
  }
  ]
}

