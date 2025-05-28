import { Logger } from '@nestjs/common'
import { HttpException, Injectable } from '@nestjs/common'
import { HttpTransportService } from '@core/http-transport.service'
import { PlayableItem, Uri } from '@views/index'

@Injectable()
export class TuneinSearchService {
  private readonly transport: HttpTransportService = new HttpTransportService()

  private parseId(id: string) {
    return id.replaceAll('tunein:', '')
  }

  public async getStation(guideId: string) {
    const params = new URLSearchParams()
    params.append('render', 'json')
    params.append('formats', 'mp3,aac,ogg,flash,html,hls,wma')
    params.append('partnerId', 'RadioTime')
    const url =
      'https://api.radiotime.com/profiles/' + this.parseId(guideId) + '?' + params.toString()
    const result = await fetch(url, { method: 'GET' })

    const obj = await result.json()
    return obj.Item
  }

  public async getStreamUrl(guideId: string) {
    const params = new URLSearchParams()
    params.append('id', this.parseId(guideId))
    params.append('render', 'json')
    params.append('formats', 'mp3,aac,ogg,flash,html,hls,wma')
    params.append('partnerId', 'RadioTime')
    params.append('version', '4.4601')
    params.append('itemUrlScheme', 'secure')
    params.append('reqAttempt', '1')
    const url = 'https://opml.radiotime.com/Tune.ashx?' + params.toString()
    const result = await fetch(url, { method: 'GET' })

    const obj = await result.json()
    return obj.body
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
            const st: any = {} as any
            st.stationuuid = 'tunein:' + ':station:' + c.GuideId
            st.radioUrl = ''
            st.guideId = c.GuideId
            st.image = c.Image
            st.title = c.Title
            st.shareUrl = c.Actions.Share.ShareUrl

            view.push(st)
          })
          break
      }
    }

    view = view.sort((a, b) => {
      return a.title.localeCompare(b.title)
    })

    return view
  }
}
