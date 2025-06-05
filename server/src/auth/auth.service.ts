import { UserService } from '@data/user.service'
import { ProfileMapper } from '@mappers/index'
import { Injectable } from '@nestjs/common'
import { Profile } from '@views/profile'
import * as crypto from 'crypto'
import * as util from 'util'

import { scopes } from './scopes'

const execFile = util.promisify(require('node:child_process').execFile)

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  private getRedirectUrl(url: string) {
    if (url && url != '') {
      return url
    }
    return `${process.env.PISTEREO_BASEURL}/api/auth/response`
  }

  public async getProfile(token: string, user = ''): Promise<Profile> {
    let url = 'https://api.spotify.com/v1/me'

    if (user) {
      url = `https://api.spotify.com/v1/users/${user}`
    }

    const result = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Bearer ' + token,
      },
    })

    const json = await result.json()
    return ProfileMapper(json)
  }

  public async getAuthorisationUrl(state: string, redirectUrl: string): Promise<string> {
    const verifier = state == '' ? this.generateCodeVerifier(128) : state

    const params = new URLSearchParams()
    params.append('client_id', process.env.PISTEREO_CLIENTID as string)
    params.append('response_type', 'code')
    params.append('redirect_uri', this.getRedirectUrl(redirectUrl))

    params.append('scope', scopes.join(' '))
    params.append('state', verifier)

    const result: any = {
      url: `https://accounts.spotify.com/authorize?${params.toString()}`,
      state: verifier,
    }
    return result
  }

  public async getAccessToken(
    code: string,
    verifier: string,
    grantType = 'authorization_code',
    redirectUrl: string,
  ): Promise<any> {
    const params = new URLSearchParams()
    params.append('grant_type', grantType)
    params.append('code', code)
    params.append('redirect_uri', this.getRedirectUrl(redirectUrl))
    params.append('code_verifier', verifier)

    const result = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' +
          Buffer.from(
            (process.env.PISTEREO_CLIENTID as string) +
              ':' +
              (process.env.PISTEREO_CLIENTSECRET as string),
          ).toString('base64'),
      },
      body: params,
    })

    const body: any = await result.json()

    if (body) {
      const user = await this.getProfile(body.access_token)
      await this.userService.addSession(body.access_token, body.refresh_token, user, body.expires)
      await this.userService.addUser(user)
      body.user = user ? user : {}
    }

    return body
  }

  k

  public async getRefreshToken(accessToken: string, refreshToken: string): Promise<any> {
    const url = 'https://accounts.spotify.com/api/token'

    const payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Bearer ' + accessToken,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: process.env.PISTEREO_CLIENTID as string,
      }),
    }

    const body = await fetch(url, payload)
    const response = await body.json()
    const user = await this.getProfile(response.access_token)
    await this.userService.addSession(
      response.access_token,
      response.refresh_token,
      user,
      response.expires,
    )
    await this.userService.addUser(user)
    return response
  }

  private generateCodeVerifier(length: number) {
    let text = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
  }

  private async generateCodeChallenge(codeVerifier: string) {
    const data = new TextEncoder().encode(codeVerifier)
    const digest = await crypto.subtle.digest('SHA-256', data)
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
  }
}
