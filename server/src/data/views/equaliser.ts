export class Channel {
  name = ''

  value = 60
}

export class Frequency {
  numid = 0

  min = 0

  max = 100

  steps = 1

  name = ''

  title = ''

  channels: Channel[] = [] as Channel[]

  value = 0
}

export class Mixer {
  frequencies: Frequency[] = [] as Frequency[]

  device = ''

  add(numid: number, name: string, channels: Channel[], min = 0, max = 100, steps = 1) {
    this.frequencies.push({
      numid: numid,
      min: min,
      max: max,
      steps: steps,
      name: name,
      title: name.slice(name.indexOf(' ')).replaceAll(' Playback Volume', '').trim(),
      channels: channels,
      value: channels[0].value,
    })
  }
}
