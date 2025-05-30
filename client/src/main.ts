/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Stores
import { useAuthStore } from '@/stores/auth'

// Composables
import { useEventBus } from './composables/useeventbus'
import { createApp } from 'vue'

// Styles
import 'unfonts.css'
import '@/assets/global.css'

// Services
import { PlayerService } from './services/player.service'

const app = createApp(App)
registerPlugins(app)

const emitter = useEventBus()
const authStore = useAuthStore()

app.config.globalProperties.emitter = emitter

if (authStore.tokens.access != '') {
  const playerService = new PlayerService()
  playerService
    .restoreSettings("equal")
    .then((res) => {
      app.mount('#app')
    })
    .catch((err) => {
      console.error(err)
      app.mount('#app')
    })
} else {
  window.location.href = '/api/auth/authorise'
}

// app.mount('#app')
