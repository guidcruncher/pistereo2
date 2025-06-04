import { Injectable } from '@nestjs/common'
import * as googleTTS from 'google-tts-api'

import { MpvPlayerService } from '../mpv/mpv-player.service'

@Injectable()
export class TtsService {
  constructor(private readonly mpvService: MpvPlayerService) {}

  async say(text: string, lang: string, slow: boolean) {
    const results = googleTTS.getAllAudioUrls(text, {
      lang: lang,
      slow: slow,
      host: 'https://translate.google.com',
      splitPunct: ',.?',
    })

    return await this.mpvService.playlist(
      results.map((a) => {
        return a.url
      }),
      true,
    )
  }
}
