import { type PlayableItem } from '../dto/playableitem'
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    theme: 'dark',
    pinned: false,
    currentTab: 'nowplaying',
  }),
  actions: {
    updateTheme(theme) {
      this.theme = theme
    },
    updatePinned(pinned) {
      this.pinned = pinned
    },
    updateCurrentTab(currentTab) {
      this.currentTab = currentTab
    },
  },
  persist: {
    storage: localStorage,
  },
})
