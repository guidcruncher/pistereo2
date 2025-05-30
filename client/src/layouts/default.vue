<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { theme, pinned, currentTab } = storeToRefs(userStore)

const drawer = ref(false || pinned.value)

function onPinClick() {
  userStore.updatePinned(!pinned.value)
}
</script>

<script lang="ts">
export default {
  name: 'Default',
  data() {
    return {}
  },
  mounted() {},
  beforeUnmount() {},
  methods: {
    showTab(tab) {
      const userStore = useUserStore()
      userStore.updateCurrentTab(tab)
    },
    onThemeChooserClick() {
      const userStore = useUserStore()
      if (theme.value == 'dark') {
        userStore.updateTheme('light')
      } else {
        userStore.updateTheme('dark')
      }
    },
  },
}
</script>
<template>
  <header></header>
  <v-app :theme="theme">
    <v-app-bar color="primary">
      <template #prepend>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
        <template v-if="drawer">
          <v-btn v-if="!pinned" size="small" icon="mdi-pin" @click.stop="onPinClick()" />
          <v-btn v-if="pinned" size="small" icon="mdi-pin-off" @click.stop="onPinClick()" />
        </template>
      </template>

      <v-app-bar-title>PiStereo2</v-app-bar-title>

      <v-spacer />

      <v-btn
        :prepend-icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
        slim
        @click="onThemeChooserClick"
      />

      <template #append>
        <v-menu>
          <template #activator="{ props }">
            <v-btn icon="mdi-dots-vertical" v-bind="props" />
          </template>
          <v-list>
            <v-list-item @click="onThemeChooserClick">
              <v-list-item-title>Toggle Theme</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" :permanent="pinned" :temporary="!pinned">
      <v-list-item title="PiStereo2" subtitle="Your music jukebox!"></v-list-item>
      <v-divider></v-divider>
      <v-list-item link title="Now Playing" @click="showTab('nowplaying')"
        ><template v-slot:prepend>
          <v-icon icon="mdi-play"></v-icon>
        </template>
      </v-list-item>
      <v-list-item link title="Playing Queue" @click="showTab('queue')"
        ><template v-slot:prepend>
          <v-icon icon="mdi-humanqueue"></v-icon>
        </template>
      </v-list-item>
      <v-list-item link title="My Playlists" @click="showTab('myplaylists')"
        ><template v-slot:prepend>
          <v-icon icon="mdi-playlist-play"></v-icon>
        </template>
      </v-list-item>
      <v-list-item link title="Saved Albums" @click="showTab('savedalbums')"
        ><template v-slot:prepend>
          <v-icon icon="mdi-album"></v-icon>
        </template>
      </v-list-item>
      <v-list-item link title="Saved Tracks" @click="showTab('savedtracks')"
        ><template v-slot:prepend>
          <v-icon icon="mdi-music"></v-icon>
        </template>
      </v-list-item>
      <v-list-item link title="Saved Podcasts" @click="showTab('savedpodcasts')"
        ><template v-slot:prepend>
          <v-icon icon="mdi-podcast"></v-icon>
        </template>
      </v-list-item>
      <v-list-item link title="Saved Episodes" @click="showTab('savedepisodes')"
        ><template v-slot:prepend>
          <v-icon icon="mdi-surround-sound"></v-icon>
        </template>
      </v-list-item>
      <v-list-item link title="Radio" @click="showTab('radio')"
        ><template v-slot:prepend>
          <v-icon icon="mdi-radio"></v-icon>
        </template>
      </v-list-item>
      <v-list-item link title="Search" @click="showTab('search')"
        ><template v-slot:prepend>
          <v-icon icon="mdi-magnify"></v-icon>
        </template>
      </v-list-item>
    </v-navigation-drawer>
    /
    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts"></script>

<style scoped></style>
