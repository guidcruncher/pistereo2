<script lang="ts" setup>
import { useVolumeStore } from '@/stores/volume'

const volumeStore = useVolumeStore()
</script>
<script lang="ts">
import { PlayerService } from '@/services/player.service'
import { on, emit, off } from '@/composables/useeventbus'

export default {
  name: 'VolumeControl',
  props: {},
  data() {
    return {}
  },
  mounted() {
    const playerService = new PlayerService()
    playerService
      .getStatus()
      .then((value) => {
        if (value.device.active) {
          const volumeStore = useVolumeStore()
          volumeStore.setVolume(value.device.volume)
          volumeStore.setLastVolume(value.device.volume)
        }
      })
      .catch((err) => {
        console.error(err)
      })
  },
  beforeUnmount() {},
  methods: {
    muteVolume() {
      const volumeStore = useVolumeStore()
      const playerService = new PlayerService()
      playerService.setVolume(0).then(() => {
        volumeStore.setVolume(0)
        volumeStore.setMuteState(true)
      })
    },
    unmuteVolume() {
      const volumeStore = useVolumeStore()
      const playerService = new PlayerService()
      playerService.setVolume(volumeStore.lastVolume).then(() => {
        volumeStore.setVolume(volumeStore.lastVolume)
        volumeStore.setMuteState(false)
      })
    },
    setVolume(level) {
      const playerService = new PlayerService()
      playerService
        .setVolume(level)
        .then((result) => {
          const volumeStore = useVolumeStore()
          volumeStore.setVolume(level)
        })
        .catch((err) => {
          console.error(err)
        })
    },
  },
}
</script>
<template>
  <v-slider
    v-model="volumeStore.volume"
    append-icon="mdi-volume-high"
    prepend-icon="mdi-volume-mute"
    track-color="primary"
    step="1"
    min="0"
    max="100"
    @click:append="unmuteVolume()"
    @click:prepend="muteVolume()"
    @end="setVolume(volumeStore.volume)"
  ></v-slider>
</template>
<style></style>
