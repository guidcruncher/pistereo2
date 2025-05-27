export class Channel {
  name: string = ''
  value: number = 60
}

export class Frequency {
  numid: number = 0
  min: number = 0
  max: number = 100
  steps: number = 1
  name: string = ''
  title: string = ''
  channels: Channel[] = [] as Channel[]
  order: number = 10
}

export class Mixer {
  frequencies: Frequency[] = [] as Frequency[]

  private lastOrder: number = 0

  add(
    numid: number,
    name: string,
    channels: Channel[],
    min: number = 0,
    max: number = 100,
    steps: number = 1,
  ) {
    this.lastOrder += 10
    this.frequencies.push({
      numid: numid,
      min: min,
      max: max,
      steps: steps,
      name: name,
      title: name.slice(name.indexOf(' ')).replaceAll(' Playback Volume', '').trim(),
      channels: channels,
      order: this.lastOrder,
    })
  }
}
