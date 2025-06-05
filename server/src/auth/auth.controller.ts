import { User } from '@auth/decorators'
import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common'
import { ApiExcludeEndpoint, ApiOAuth2 } from '@nestjs/swagger'

import { SettingService } from '@/data/setting.service'

import { AuthService } from './auth.service'
import { AuthToken, Private, Public } from './decorators'

@Public()
@Controller('/api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly settingService: SettingService,
  ) {}

  @ApiExcludeEndpoint()
  @Get('authorise')
  async getAuthorisationUrl(
    @Query('redirect_uri') redirectUrl: string,
    @Query('state') state: string,
    @Res() res,
  ) {
    const authUrl: any = await this.authService.getAuthorisationUrl(state ?? '', redirectUrl)
    res.status(302).redirect(authUrl.url)
  }

  @ApiExcludeEndpoint()
  @Post('response')
  async authoriseResponsePost(@Body() data: any, @Res() res) {
    const token: any = await this.authService.getAccessToken(
      data.code,
      data.state ?? '',
      data.grant_type ?? 'authorization_code',
      data.redirect_uri,
    )
    const targeturl = '/'
    return res.status(200).send(token)
  }

  @ApiExcludeEndpoint()
  @Get('response')
  async authoriseResponse(
    @Query('code') code: string,
    @Query('state') state: string,
    @Query('redirect_uri') redirectUrl: string,
    @Res() res,
  ) {
    const token: any = await this.authService.getAccessToken(
      code,
      state,
      'authorization_code',
      redirectUrl,
    )
    const targeturl = '/'

    res.header('Content-Type', 'text/html')
    const html =
      '<html><head><title>PiStereo2</title></head><body><script type="text/javascript">' +
      'sessionStorage.setItem("auth", JSON.stringify({ tokens: {access: "' +
      token.access_token +
      '", refresh: "' +
      token.refresh_token +
      '", userid: "' +
      token.user.id +
      '", name:"' +
      token.user.name +
      '", imageUrl:"' +
      token.user.imageUrl +
      '", country: "' +
      token.user.country +
      '" }}));' +
      'window.location.href="' +
      targeturl +
      '";' +
      '</script></body></html>'
    res.status(200).send(html)
  }

  @ApiExcludeEndpoint()
  @Post('refresh')
  @Private()
  async tokenRefresh(@User() user: any, @AuthToken() token: string, @Body() data: any) {
    const result = await this.authService.getRefreshToken(token, data.refresh_token)
    return result
  }

  @ApiOAuth2(['user-read-private', 'user-read-email'], 'Api')
  @Get('user/:user')
  @Private()
  async getProfile(@AuthToken() token, @Param('user') user: string) {
    const result = await this.authService.getProfile(token, user)
    return result
  }

  @ApiOAuth2(['user-read-private', 'user-read-email'], 'Api')
  @Get('user')
  @Private()
  async getMyProfile(@AuthToken() token) {
    const result = await this.authService.getProfile(token)
    return result
  }
}
