<script lang="ts" setup>
import { useVolumeStore } from '@/stores/volume'

const volumeStore = useVolumeStore()
</script>
<script lang="ts">
import { PlayerService } from '@/services/player.service'
import { on, emit, off } from '@/composables/useeventbus'

export default {
  name: 'QueueView',
  props: {},
  data() {
    return {
      windowSize: { x: 0, y: 300 },
      items: [] as any,
      ready: false,
    }
  },
  mounted() {
    this.onResize()
    this.loadData()
    on('track_changed', () => {
      this.loadData()
    })
  },
  beforeUnmount() {
    off('track_changed')
  },
  methods: {
    addPreset(uri) {
      const playerService = new PlayerService()
      playerService.addPreset(uri)
    },
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
    loadData() {
      const playerService = new PlayerService()
      playerService
        .listQueue(0, 10)
        .then((list) => {
          if (list.queue.length > 0) {
            this.items = list.queue
            this.ready = true
          } else {
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },
  },
}
</script>
<template>
  <v-card>
    <v-card-item>
      <v-card-title>Playing Queue </v-card-title>
      <v-card-subtitle></v-card-subtitle>
    </v-card-item>
    <v-card-text>
      <v-sheet :height="windowSize.y" v-resize="onResize">
        <div style="height: 100%; overflow-y: scroll">
          <v-list>
            <v-list-item v-for="item in items" :key="item" :value="item">
              <div class="pa-1" v-ripple>
                <div style="float: left" @click="loadPlaylist(item)">
                  <table border="0" cellpadding="0" cellspacing="0">
                    <tbody>
                      <tr>
                        <td>
                          <ScaledImage :src="item.imageUrl" size="xs" style="margin-right: 16px" />
                        </td>
                        <td>
                          <div class="text-subtitle-1">{{ item.name }}</div>
                          <div class="text-body-2">{{ item.album.name }}</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div style="float: right">
                  <v-btn icon="mdi-star-plus" @click="addPreset(item.uri)"></v-btn>
                </div>
              </div>
            </v-list-item>
          </v-list>
        </div>
      </v-sheet>
    </v-card-text>
  </v-card>
</template>
<style></style>
