import { type PlayableItem } from '../dto/playableitem'
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useVolumeStore = defineStore('volume', {
  state: () => ({
    volume: 0,
    lastVolume: 0,
    muted: false,
  }),
  actions: {
    setMuteState(value) {
      this.muted = value
    },
    toggleMute() {
      this.muted = !this.muted
    },
    setVolume(value) {
      if (value >= 0 && value <= 100) {
        this.lastVolume = this.volume
        this.volume = value
      }
      this.muted = this.volume == 0
    },
    setLastVolume(value) {
      if (value >= 0 && value <= 100) {
        this.lastVolume = value
      }
    },
  },
  persist: {
    storage: sessionStorage,
  },
})
