<template>
  <v-tabs v-model="currentTab" align-tabs="title">
    <v-tab text="Playing" value="nowplaying"></v-tab>
    <v-tab text="Queue" value="queue"></v-tab>
    <v-tab text="Playlists" value="myplaylists"></v-tab>
    <v-tab text="Albums" value="savedalbums"></v-tab>
    <v-tab text="Tracks" value="savedtracks"></v-tab>
    <v-tab text="Podcasts" value="savedpodcasts"></v-tab>
    <v-tab text="Episodes" value="savedepisodes"></v-tab>
    <v-tab text="Search" value="search"></v-tab>
    <v-tab text="Control" value="radio"></v-tab>
  </v-tabs>
  <v-tabs-window v-model="currentTab">
    <v-tabs-window-item value="nowplaying">
      <div class="center pa-2">
        <div>
          <Player />
        </div>
      </div>

      <div class="pa-2">
        <div>
          <Presets />
        </div>
      </div>
    </v-tabs-window-item>
    <v-tabs-window-item value="queue">
      <QueueView />
    </v-tabs-window-item>
    <v-tabs-window-item value="myplaylists">
      <PlaylistsView />
    </v-tabs-window-item>
    <v-tabs-window-item value="savedalbums">
      <AlbumListsView />
    </v-tabs-window-item>
    <v-tabs-window-item value="savedtracks">
      <TrackListsView />
    </v-tabs-window-item>
    <v-tabs-window-item value="savedpodcasts">
      <ShowListsView />
    </v-tabs-window-item>
    <v-tabs-window-item value="savedepisodes">
      <EpisodeListsView />
    </v-tabs-window-item>
    <v-tabs-window-item value="radio">
      <div class="pa-2">
        <div>
          <Mixer />
        </div>
      </div>
    </v-tabs-window-item>
    <v-tabs-window-item value="search">
      <SearchControl />
    </v-tabs-window-item>
  </v-tabs-window>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { currentTab } = storeToRefs(userStore)
</script>
<script lang="ts">
export default {
  name: 'Index',
  props: {},
  data() {
    return {}
  },
  mounted() {},
  beforeUnmount() {},
  methods: {},
}
</script>
