import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { on, emit, off } from '../composables/useeventbus'

export class BaseService {
  private baseUrl: string

  constructor(baseurl: string) {
    this.baseUrl = baseurl
  }

  client(options: any = {}) {
    const opt: any = options ?? {}
    if (opt.isPublic) {
      return axios.create({
        baseURL: opt.baseUrl ?? this.baseUrl,
        headers: {
          'Content-type': opt.contentType ?? 'application/json',
        },
      })
    }

    const authStore = useAuthStore()
    const tokens = authStore.tokens ?? { access: '', refresh: '' }

    const client = axios.create({
      baseURL: opt.baseUrl ?? this.baseUrl,
      headers: {
        'Content-type': opt.contentType ?? 'application/json',
        Authorization: 'Bearer ' + tokens.access,
      },
    })

    if (!opt.disableInterceptor) {
      this.createAxiosResponseInterceptor(client)
    }

    return client
  }

  private createAxiosResponseInterceptor(instance: any) {
    const interceptor = instance.interceptors.response.use(
      (response) => response,
      (error) => {
        // Reject promise if usual error
        if (error.response.status !== 401) {
          return Promise.reject(error)
        }

        const authStore = useAuthStore()
        const tokens = authStore.tokens ?? { access: '', refresh: '' }

        instance.interceptors.response.eject(interceptor)

        return instance
          .post('/api/auth/refresh', { access_token: tokens.access, refresh_token: tokens.refresh })
          .then((response: any) => {
            if (!response.data || !response.data.access_token) {
              authStore.updateTokens({ access: '', refresh: '' })
              window.location.href = '/api/auth/authorise'
              return
            }

            authStore.updateTokens({
              access: response.data.access_token,
              refresh: response.data.refresh_token,
            })
            error.response.config.headers['Authorization'] = 'Bearer ' + response.data.access_token
            return instance(error.response.config)
          })
          .catch((error2) => {
            // Retry failed, clean up and reject the promise
            authStore.updateTokens({ access: '', refresh: '' })
            window.location.href = '/api/auth/authorise'
            return Promise.reject(error2)
          })
          .finally(this.createAxiosResponseInterceptor(instance)) // Re-attach the interceptor by running the method
      },
    )
  }
}
