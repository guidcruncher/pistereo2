import { HttpException, Injectable } from '@nestjs/common'

@Injectable()
export class PushoverService {
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

    throw new HttpException((await res.text()), res.status)
  }
}
