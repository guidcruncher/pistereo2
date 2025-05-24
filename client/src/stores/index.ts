// Utilities
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const initialisePinia = () => {
  let pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)
  return pinia
}

export default initialisePinia()
