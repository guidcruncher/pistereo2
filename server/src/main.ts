declare const module: any
import * as fs from 'node:fs'
import { getScopes } from '@auth/scopes'
import { ConsoleLogger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'
import compression = require('compression')

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      colors: true,
      prefix: 'Server',
    }),
  })

  const baseUrl: string = process.env.PISTEREO_BASEURL as string
  const listenAddr = process.env.PISTEREO_LISTEN_PORT ?? '3000'

  //  app.use(helmet())
  app.use(compression())

  const config = new DocumentBuilder()
    .addServer('/api')
    .setTitle('PiStereo2 API')
    .setDescription('The PiStereo2 API')
    .setVersion('1.0')
    .addTag('pistereo2')
    .addOAuth2(
      {
        type: 'oauth2',
        scheme: 'bearer',
        in: 'header',
        flows: {
          authorizationCode: {
            authorizationUrl: baseUrl + '/api/auth/authorise',
            tokenUrl: baseUrl + '/api/auth/response',
            refreshUrl: baseUrl + '/api/auth/refresh',
            scopes: getScopes(),
          },
        },
      },
      'Api',
    )
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, documentFactory, {
    swaggerOptions: {
      initOAuth: {
        clientId: process.env.PISTEREO_CLIENTID as string,
        clientSecret: process.env.PISTEREO_CLIENTSECRET as string,
      },
      ui: true,
      explorer: true,
    },
  })

  app.enableShutdownHooks()

  await app.listen(parseInt(listenAddr))

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }
}

bootstrap()
