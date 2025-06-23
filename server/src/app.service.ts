import * as dns from 'node:dns'
import * as os from 'node:os'
import {
  OnApplicationBootstrap,
  BeforeApplicationShutdown,
  Injectable,
  Scope,
  Logger,
} from '@nestjs/common'
const dnssd = require('dnssd')

@Injectable({ scope: Scope.DEFAULT })
export class AppService implements OnApplicationBootstrap, BeforeApplicationShutdown {
  private readonly logger: Logger = new Logger(AppService.name, {
    timestamp: true,
  })

  private service: any = {}

  onApplicationBootstrap() {
    this.service = new dnssd.Advertisement(
      dnssd.tcp('pistereo2'),
      parseInt(process.env.PISTEREO_MDNS_PORT ?? '8080'),
      {
        name: `${os.hostname()} - PiStereo2`,
        hostname: os.hostname(),
        interface: 'eth0',
      },
    )
    this.service.start()
  }

  beforeApplicationShutdown(signal: string) {
    this.service.stop()
  }
}
