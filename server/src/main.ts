import { NestFactory } from '@nestjs/core'
import { ConsoleLogger, Logger } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { config } from '@dotenvx/dotenvx'
import { getScopes } from '@auth/scopes'
import compression = require('compression')
import helmet from 'helmet'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      colors: true,
    }),
  })

  const baseUrl: string = process.env.PISTEREO_BASEURL as string
  const listenAddr = (process.env.PISTEREO_LISTEN_PORT ?? '3000') as string

  app.use(helmet())
  app.use(compression())

  const config = new DocumentBuilder()
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

  await app.listen(parseInt(listenAddr))
}

config()
bootstrap()
