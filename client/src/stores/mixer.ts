import { type PlayableItem } from '../dto/playableitem'
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMixerStore = defineStore('mixer', {
  state: () => ({
    locked: false,
    simple: true,
    draglock: false,
  }),
  actions: {
    setLocked(value) {
      this.locked = value
    },
    setDragLocked(value) {
      this.draglock = value
    },
    setSimple(value) {
      this.simple = value
    },
  },
  persist: {
    storage: sessionStorage,
  },
})
