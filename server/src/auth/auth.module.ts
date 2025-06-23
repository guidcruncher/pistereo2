import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'

import { DataModule } from '../data/data.module'
import { AuthController } from './auth.controller'
import { AuthGuard } from './auth.guard'
import { AuthService } from './auth.service'
import { SettingsController } from './settings.controller'

@Module({
  imports: [DataModule],
  controllers: [AuthController, SettingsController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
