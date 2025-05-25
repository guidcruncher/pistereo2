import { Logger } from 'nestjs-pino'
import { Inject, HttpException, Injectable } from '@nestjs/common'
import { getUserAgent } from './user-agent'
 
//export interface IHttpTransportService {
//  request(method: string, url: string, headers: Record<string, string>, body?)
//}

@Injectable()
export class HttpTransportService {
  @Inject(Logger)
  private readonly logger: Logger
  private readonly userAgent: string = ""

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

  public async request(method: string, url: string, headers: Record<string, string>, body?): Promise<any> {
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
      } catch (err) {this.logger.error("Error parsing API Error Response", err)}
      this.logger.error(`HTTP Error from API : ${response.status} ${txt ==''?response.statusText:txt}`)
      throw new HttpException(txt == '' ? response.statusText : txt, response.status)
    }
    if (response.status == 204) {
      return this.wrapResponse(response.statusText, response.status, {})
    }

    try {
      return this.wrapResponse(response.statusText, response.status, await response.json())
    } catch (err) {
      this.logger.error("Error occured making http request", err)
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
