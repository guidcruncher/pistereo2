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
          <v-row no-gutters class="pa-1" @click="loadPlaylist(item)" v-ripple>
            <v-col>
              <ScaledImage :src="item.imageUrl" size="xs" style="margin-right: 16px" />
            </v-col>
            <v-col cols="11">
              <v-sheet class="pa-2">
                <div class="text-subtitle-1">{{ item.name }}</div>
                <div class="text-body-2">{{ item.owner.name }}</div>
              </v-sheet>
            </v-col>
          </v-row>
        </template>
      </v-infinite-scroll>
    </v-card-text>
  </v-card>
</template>
<style></style>
