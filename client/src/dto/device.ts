export class Device {
  id: string = ''
  name: string = ''
  volume: number = 0
  active: boolean = false
  playing: boolean = false
  progress_ms: number = 0
}

export class DeviceProp {
  id: string = ''
  name: string = ''
  active: boolean = false
}
