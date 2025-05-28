import { User } from '@auth/decorators'
import {
  HttpException,
  Param,
  Req,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  Session,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { Public, Private, AuthToken } from './decorators'
import { ApiOAuth2, ApiExcludeController, ApiExcludeEndpoint } from '@nestjs/swagger'

@Public()
@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
    const targeturl: string = '/'
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
    const targeturl: string = '/'

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
    let result = await this.authService.getRefreshToken(token, data.refresh_token)
    return result
  }

  @ApiOAuth2(['user-read-private', 'user-read-email'], 'Api')
  @Get('user/:user')
  @Private()
  async getProfile(@AuthToken() token, @Param('user') user: string) {
    let result = await this.authService.getProfile(token, user)
    return result
  }

  @ApiOAuth2(['user-read-private', 'user-read-email'], 'Api')
  @Get('user')
  @Private()
  async getMyProfile(@AuthToken() token) {
    let result = await this.authService.getProfile(token)
    return result
  }
}
