import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    tokens: {
      access: '',
      refresh: '',
      userid: '',
      country: '',
      name: '',
      imageUrl: '',
    },
  }),
  actions: {
    updateTokens(partialTokens) {
      this.tokens = {
        ...this.tokens,
        ...partialTokens,
      }
    },
  },
  persist: {
    storage: sessionStorage,
  },
})
