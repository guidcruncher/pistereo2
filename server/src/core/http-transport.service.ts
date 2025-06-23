import { Logger } from '@nestjs/common'
import { HttpException, Injectable } from '@nestjs/common'

import { getUserAgent } from './user-agent'

//export interface IHttpTransportService {
//  request(method: string, url: string, headers: Record<string, string>, body?)
//}

@Injectable()
export class HttpTransportService {
  private readonly logger: Logger = new Logger(HttpTransportService.name, { timestamp: true })

  private readonly userAgent: string = ''

  constructor() {
    this.userAgent = getUserAgent()
  }

  public getQueryString(parameters: Record<string, any>): string {
    const params = new URLSearchParams()

    if (parameters) {
      for (const key in parameters) {
        params.append(key, (parameters[key] ?? '').toString())
      }
    }

    return `?${params.toString()}`
  }

  public async request(
    method: string,
    url: string,
    headers: Record<string, string>,
    body?,
  ): Promise<any> {
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

    const response = await makeRequest()

    if (!response.ok) {
      let txt = ''
      const resp: string = await response.text()
      try {
        const obj: any = JSON.parse(resp)
        txt = obj.error.message
      } catch (err) {
        txt = resp
        this.logger.error('Error parsing API Error Response -> ' + resp, err)
      }
      this.logger.error('Error from API ' + method + ' ' + url + ' => ' + txt)

      throw new HttpException(txt, response.status)
    }

    if (response.status == 204) {
      return this.wrapResponse(response.statusText, response.status, {})
    }

    try {
      return this.wrapResponse(response.statusText, response.status, await response.json())
    } catch (err) {
      this.logger.error('Error occured making http request', err)
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
