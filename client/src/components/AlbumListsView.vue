<script lang="ts" setup>
import { useVolumeStore } from '@/stores/volume'

const volumeStore = useVolumeStore()
</script>
<script lang="ts">
import { PlayerService } from '@/services/player.service'
import { on, emit, off } from '@/composables/useeventbus'

export default {
  name: 'AlbumListsView',
  props: {},
  data() {
    return {
      windowSize: { x: 0, y: 300 },
      items: [] as any,
      paging: { offset: 0, limit: 5, total: 0, page: 1, pageCount: 0 },
      ready: false,
    }
  },
  mounted() {
    this.onResize()
  },
  beforeUnmount() {},
  methods: {
    onResize() {
      this.windowSize = { x: window.innerWidth, y: window.innerHeight - 240 }
    },
    loadPlaylist(item) {
      const playerService = new PlayerService()
      playerService
        .play(item.uri)
        .then((res) => {})
        .catch((err) => {
          console.error(err)
        })
    },
    loadData({ done }) {
      const playerService = new PlayerService()
      playerService
        .listSavedAlbums(this.paging.offset, this.paging.limit)
        .then((list) => {
          if (list.items.length > 0) {
            this.items.push(...list.items)
            this.paging = list.paging
            this.ready = true
            this.paging.offset += this.paging.limit
            done('ok')
          } else {
            done('empty')
          }
        })
        .catch((err) => {
          console.error(err)
          done('error')
        })
    },
  },
}
</script>
<template>
  <v-card>
    <v-card-item>
      <v-card-title>Saved Albums </v-card-title>
      <v-card-subtitle></v-card-subtitle>
    </v-card-item>
    <v-card-text>
      <v-infinite-scroll :height="windowSize.y" v-resize="onResize" :items="items" @load="loadData">
        <template v-for="item in items" :key="item" :value="item">
          <div class="pa-1" v-ripple @click="loadPlaylist(item)">
            <table border="0" cellpadding="0" cellspacing="0">
              <tbody>
                <tr>
                  <td><ScaledImage :src="item.imageUrl" size="xs" style="margin-right: 16px" /></td>
                  <td>
                    <div class="text-subtitle-1">{{ item.name }}</div>
                    <div class="text-body-2">{{ item.artists.join(', ') }}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </v-infinite-scroll>
    </v-card-text>
  </v-card>
</template>
<style></style>
