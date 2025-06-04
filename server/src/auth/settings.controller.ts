import { User } from '@auth/decorators'
import { Controller, Get, Param, Put, Query } from '@nestjs/common'
import { ApiOAuth2, ApiQuery } from '@nestjs/swagger'

import { SettingService } from '@/data/setting.service'

import { AuthService } from './auth.service'
import { AuthToken, Private } from './decorators'

@ApiOAuth2(['user-read-private', 'user-read-email'], 'Api')
@Private()
@Controller('/api/user/settings')
export class SettingsController {
  constructor(
    private readonly authService: AuthService,
    private readonly settingService: SettingService,
  ) {}

  @Get()
  async getSettings(@AuthToken() token, @User() user: any) {
    const result = await this.settingService.getFlags(user.id)
    return result
  }

  @ApiQuery({ name: 'value' })
  @Put('/:key')
  async saveSettings(
    @AuthToken() token,
    @User() user: any,
    @Param('key') key: string,
    @Query('value') value: any,
  ) {
    const result = await this.settingService.setFlag(user.id, key, value)
    return result /*  */
  }
}
