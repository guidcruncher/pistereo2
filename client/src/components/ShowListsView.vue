<script lang="ts" setup>
import { useVolumeStore } from '@/stores/volume'

const volumeStore = useVolumeStore()
</script>
<script lang="ts">
import { PlayerService } from '@/services/player.service'
import { on, emit, off } from '@/composables/useeventbus'

export default {
  name: 'ShowListsView',
  props: {},
  data() {
    return {
      windowSize: { x: 0, y: 300 },
      items: [] as any,
      selectedShow: '',
      selectedShowName: '',
      paging: { offset: 0, limit: 5, total: 0, page: 1, pageCount: 0 },
      ready: false,
      isBrowseShow: false,
    }
  },
  mounted() {
    this.onResize()
  },
  beforeUnmount() {},
  methods: {
    addPreset(uri) {
      const playerService = new PlayerService()
      playerService.addPreset(uri)
    },
    onResize() {
      this.windowSize = { x: window.innerWidth, y: window.innerHeight - 240 }
    },
    loadPlaylist(item) {
      this.selectedShow = item.uri.uri
      this.selectedShowName = item.name
      this.isBrowseShow = true
    },
    loadData({ done }) {
      const playerService = new PlayerService()
      playerService
        .listSavedShows(this.paging.offset, this.paging.limit)
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
    <div class="text-h6">Saved Podcasts and shows</div>
    <v-infinite-scroll :height="windowSize.y" v-resize="onResize" :items="items" @load="loadData">
      <template v-for="item in items" :key="item" :value="item">
        <div class="pa-1" v-ripple>
          <div style="float: left" @click="loadPlaylist(item)">
            <table border="0" cellpadding="0" cellspacing="0">
              <tbody>
                <tr>
                  <td><ScaledImage :src="item.imageUrl" size="xs" style="margin-right: 16px" /></td>
                  <td>
                    <div class="text-subtitle-1">{{ item.name }}</div>
                    <div class="text-body-2">{{ item.publisher }}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style="float: right">
            <v-btn icon="mdi-star-plus" @click="addPreset(item.uri)"></v-btn>
          </div>
        </div>
      </template>
    </v-infinite-scroll>
  </v-card>

  <v-dialog v-model="isBrowseShow" transition="dialog-bottom-transition" fullscreen>
    <v-card>
      <v-toolbar>
        <v-btn icon="mdi-close" @click="isBrowseShow = false"></v-btn>
        <v-toolbar-title>{{ selectedShowName }}</v-toolbar-title>
      </v-toolbar>
      <EpisodeBrowser :show="selectedShow" :showTitle="selectedShowName" v-if="isBrowseShow" />
    </v-card>
  </v-dialog>
</template>
<style></style>
