import { type PlayableItem } from '../dto/playableitem'
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    currentDevice: {} as any,
    currentTrack: {} as any,
    playing: true,
    metaData: {} as any,
  }),
  actions: {
    setMetaData(metadata) {
      this.metaData = metadata
    },
    setPlayingState(playingstate) {
      this.playing = playingstate
    },
    togglePlayingState() {
      this.playing = !this.playing
    },
    updateDevice(device) {
      this.currentDevice = device
    },
    updateVolume(value) {
      this.currentDevice.volume = value
    },
    updateActive(state) {
      this.currentDevice.active = state
    },
    updatePlaying(track) {
      this.currentTrack = track
    },
  },
  persist: {
    storage: sessionStorage,
  },
})
