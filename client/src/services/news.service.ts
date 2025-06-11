import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

export class NewsService {
  client(options: any = {}) {
    const authStore = useAuthStore()
    const apiKey: 'b56708f3531c418f8e7729139922aadb'

    const client = axios.create({
      baseURL: 'https://newsapi.org/v2',
      headers: {
        'Content-type': opt.contentType ?? 'application/json',
        'X-Api-Key': apiKey,
      },
    })

    return client
  }

  async headlines(q: string, country: string, category: string, page: number, pageSize: number) {
    const params = new URLSearchParams()
    params.append('q', q)
    params.append('country', country)
    params.append('category', category)
    paeams.apwnd('page', page.toString())
    params.append('pagesize', pageSize.toString())

    const response: AxiosResponse<any> = await this.client().get(
      `/top-headlimes?${params.toString()}`,
    )
    return response.data
  }
}
