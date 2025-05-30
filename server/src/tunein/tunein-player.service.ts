import { Logger } from '@nestjs/common'
import { HttpException, Injectable } from '@nestjs/common'
import { PagedListBuilder, PlayableItem, Uri } from '@views/index'
import { PlayableItemMapper, TuneinMapper } from '@mappers/index'
import { MpvPlayerService } from '../mpv/mpv-player.service'

@Injectable()
export class TuneinPlayerService {
  constructor(private readonly mpvService: MpvPlayerService) {}

  public async play(uri: Uri) {
    const station: any = await this.getStation(uri)
    if (station && station.url != '') {
      await this.mpvService.play(station.url)
      station.uri = uri
      return station
    }

    throw new HttpException('Station not found', 404)
  }

  public async getStatus() {
    const state = await this.mpvService.getStatus()
    return state
  }

  public async getDetail(uri: Uri) {
    const params = new URLSearchParams()
    params.append('render', 'json')
    params.append('id', uri.id)

    const result = await fetch('https://opml.radiotime.com/describe.ashx?' + params.toString(), {
      method: 'GET',
    })

    if (!result.ok) {
      throw new HttpException(result.statusText, result.status)
    }

    const obj: any = (await result.json()).body[0]
    obj.uri = uri
    return obj
  }

  public async getStation(parsedUri: Uri) {
    if (parsedUri.source != 'tunein') {
      throw new HttpException(`Expected source tunein, got ${parsedUri.source}`, 400)
    }

    const params = new URLSearchParams()
    params.append('render', 'json')
    params.append('formats', 'mp3,aac,ogg,flash,html,hls,wma')
    params.append('partnerId', 'RadioTime')
    const url = 'https://api.radiotime.com/profiles/' + parsedUri.id + '?' + params.toString()
    const result = await fetch(url, { method: 'GET' })

    if (!result.ok) {
      throw new HttpException(result.statusText, result.status)
    }

    const obj: any = await result.json()
    obj.Item.url = ''
    const urls: any = await this.getStreamUrl(parsedUri)
    if (urls) {
      obj.Item.url = urls[0].url
    }
    return TuneinMapper(obj.Item)
  }

  public async getStreamUrl(parsedUri: Uri) {
    if (parsedUri.source != 'tunein') {
      throw new HttpException(`Expected source tunein, got ${parsedUri.source}`, 400)
    }

    const params = new URLSearchParams()
    params.append('id', parsedUri.id)
    params.append('render', 'json')
    params.append('formats', 'mp3,aac,ogg,flash,html,hls,wma')
    params.append('partnerId', 'RadioTime')
    params.append('version', '4.4601')
    params.append('itemUrlScheme', 'secure')
    params.append('reqAttempt', '1')
    const url = 'https://opml.radiotime.com/Tune.ashx?' + params.toString()
    const result = await fetch(url, { method: 'GET' })
    if (!result.ok) {
      throw new HttpException(result.statusText, result.status)
    }

    const obj = await result.json()
    if (obj && obj.body) {
      return obj.body
    }
    throw new HttpException('Station url not found', 404)
  }

  public async search(query: string, offset: number, limit: number): Promise<any> {
    const params = new URLSearchParams()
    params.append('fullTextSearch', 'true')
    params.append('formats', 'mp3,aac,ogg,flash,html,hls,wma')
    params.append('partnerId', 'RadioTime')
    params.append('itemUrlScheme', 'secure')
    params.append('reqAttempt', '1')
    params.append('query', query)
    const url = 'https://api.tunein.com/profiles?' + params.toString()

    const result = await fetch(url, { method: 'GET' })

    const obj = await result.json()

    let view: any[] = []

    for (const item of obj.Items) {
      switch (item.ContainerType) {
        case 'Stations':
          item.Children.forEach((c) => {
            const ch: any = { Item: c }
            ch.Item.url = ''
            const st = TuneinMapper(ch.Item)
            view.push(st)
          })
          break
      }
    }

    view = view.sort((a, b) => {
      return a.name.localeCompare(b.name)
    })

    return PagedListBuilder.fromMappedArray<PlayableItem>(view, offset, limit)
  }
}
