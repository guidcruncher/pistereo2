import { HttpException, Logger, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { MediaServer } from '@schemas/index'
import * as crypto from 'crypto'
import { Model } from 'mongoose'

@Injectable()
export class MediaServerService {
  private readonly logger: Logger = new Logger(MediaServerService.name, {
    timestamp: true,
  })

  constructor(@InjectModel(MediaServer.name) private deviceModel: Model<MediaServer>) {}

  async saveDevice(item: MediaServer) {
    return await this.deviceModel.findOneAndUpdate({ id: item.id }, item, { upsert: true })
  }

  async find(id: string) {
    const item = await this.deviceModel.findOne({ id: id }).lean()
    return item
  }

  async getActive() {
    const items = await this.deviceModel.find().lean()
    return items
  }

  async delete(id: string) {
    const item = await this.deviceModel.deleteOne({ id: id })
    return item
  }

  async mediaServerRequest(
    token: string,
    method: string,
    url: string,
    body: any = {},
  ): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.getActive()
        .then((devices) => {
          if (!devices) {
            this.logger.error('No registered mediaservers')
            reject()
          }

          let promises: Promise<any>[] = []

          for (var i = 0; i < devices.length; i++) {
            promises.push(
              new Promise<any>((resolve, reject) => {
                try {
                  let apiUrl = devices[i].apiUrl + url

                  if (body && ['PUT', 'POST'].includes(method.toUpperCase())) {
                    this.logger.debug(
                      `MediaServer request => ${method} ${apiUrl}`,
                      JSON.stringify(body),
                    )
                    fetch(apiUrl, {
                      method: method.toUpperCase(),
                      headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(body),
                    })
                      .then((response) => {
                        if (response.ok) {
                          return response.json()
                        }
                        throw new HttpException(response.text(), response.status)
                      })
                      .then((data) => {
                        resolve(data)
                      })
                      .catch((err) => {
                        this.logger.error('Mediaserver op error', err)
                        reject(err)
                      })
                  } else {
                    this.logger.debug(`MediaServer request => ${method} ${apiUrl}`)
                    fetch(apiUrl, {
                      method: method.toUpperCase(),
                      headers: { Authorization: `Bearer ${token}` },
                    })
                      .then((response) => {
                        this.logger.verbose(
                          'MediaServer response',
                          response.status,
                          response.statusText,
                        )
                        return response.json()
                      })
                      .then((data) => {
                        resolve(data)
                      })
                      .catch((err) => {
                        this.logger.error('Mediaserver op error', err)
                        reject(err)
                      })
                  }
                } catch (err) {
                  reject(err)
                  this.logger.error('Mediaserver op error', err)
                }
              }),
            )
          }

          Promise.allSettled(promises).then((results) => {
            let fulfilled = results.filter((f) => {
              return f.status == 'fulfilled'
            })
            if (fulfilled.length == 0) {
              this.logger.error('No successful mediaserver requests made')
            }
            return resolve(fulfilled.length > 0 ? fulfilled[0].value : {})
          })
        })
        .catch((err) => {
          this.logger.error('Mediaserver op request error', err)
          reject()
        })
    })
  }
}
