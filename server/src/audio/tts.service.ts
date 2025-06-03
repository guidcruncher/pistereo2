import { Injectable } from '@nestjs/common'
import * as googleTTS from 'google-tts-api'
import { MpvService } from '../mpv/mpv.service'
import * as fs from 'fs'
import * as path from 'path'

@Injectable()
export class TtsService {
  constructor(private readonly mpvService: MpvService) {}

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
    )
  }
}
