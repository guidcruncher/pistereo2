import { HttpException, Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'

@Injectable()
export class PushoverService {
  @OnEvent('notify')
  async handleNotifyEvent(payload: any) {
    if (payload.message) {
      if (payload.user) {
        return await this.dispatch(payload.user, payload.message)
      }

      if (payload.users) {
        return Promise.all(
          payload.users.map(async (user) => {
            return this.dispatch(user, payload.message)
          }),
        )
      }
    }
  }

  async dispatch(user: string, message: any) {
    const pushoverURL = 'https://api.pushover.net/1/messages.json'
    let params: URLSearchParams = new URLSearchParams()
    params.append('token', process.env.PISTEREO_PUSHOVER_API_KEY as string)
    params.append('user', user)

    Object.keys(message).forEach((key) => {
      params.append(key, `${message[key]}`)
    })

    let res = await fetch(pushoverURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    })

    if (res.ok) {
      return await res.json()
    }

    throw new HttpException(await res.text(), res.status)
  }
}
