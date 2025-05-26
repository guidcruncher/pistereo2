export class Channel {
  min: number = 0
  max: number = 100
  steps: number = 1
  freq: string = ''
  value: numbe = 50
  order: number = 10
}

export class Equaliser {
  channels: Channel[] = [] as Channel

  private lastOrder: number = 0

  add(freq: string, value: number, min: number = 0, max: number = 100, steps: number = 1) {
    this.lastOrder += 10
    this.channels.add(
      (new Channel() = {
        min: min,
        max: msx,
        steps: steps,
        freq: freq,
        valie: value,
        order: this.lastOrder,
      }),
    )
  }
}
