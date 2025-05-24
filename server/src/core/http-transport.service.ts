import { HttpException, Injectable } from '@nestjs/common'

//export interface IHttpTransportService {
//  request(method: string, url: string, headers: Record<string, string>, body?)
//}

@Injectable()
export class HttpTransportService {
  public getQueryString(parameters: Record<string, any>): string {
    const params = new URLSearchParams()

    if (parameters) {
      for (const key in parameters) {
        params.append(key, (parameters[key] ?? '').toString())
      }
    }

    return `?${params.toString()}`
  }

  public async request(method: string, url: string, headers: Record<string, string>, body?) {
    const makeRequest = () => {
      if (body && ['PUT', 'POST'].includes(method.toUpperCase())) {
        return fetch(url, {
          method: method.toUpperCase(),
          headers: headers,
          body: JSON.stringify(body),
        })
      }

      return fetch(url, {
        method: method,
        headers: headers,
      })
    }

    let response = await makeRequest()

    if (!response.ok) {
      let txt: string = ''
      try {
        let obj: any = await response.json()
        txt = obj.error.message
      } catch (err) {}
      throw new HttpException(txt == '' ? response.statusText : txt, response.status)
    }
    if (response.status == 204) {
      return this.wrapResponse(response.statusText, response.status, {})
    }

    try {
      return this.wrapResponse(response.statusText, response.status, await response.json())
    } catch (err) {
      return this.wrapResponse(response.statusText, response.status, {})
    }
  }

  public wrapResponse(statusText: string, status: number, json) {
    if (json) {
      return {
        status: status,
        statusText: statusText,
        value: json,
      }
    }

    return { status: status, statusText: statusText }
  }
}
