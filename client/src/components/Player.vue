<script lang="ts" setup>
import { on, emit, off } from '@/composables/useeventbus'
import { PlayerService } from '@/services/player.service'
import { type PlayableItem } from '@/dto/playableitem'
import { storeToRefs } from 'pinia'
import { usePlayerStore } from '@/stores/player'
import { useEventSource } from '@/composables/useeventsource'
import { useVolumeStore } from '@/stores/volume'

const volumeStore = useVolumeStore()
const playerStore = usePlayerStore()
const { currentTrack, playing, metaData } = storeToRefs(playerStore)
const playerEventSource = useEventSource('player', (type, payload) => {
  switch (type) {
    case 'metadataUpdate':
      if (payload.data) {
        playerStore.setMetaData(payload.data)
      }
      break
    case 'trackChanged':
      playerStore.setMetaData({})
      if (payload.track) {
        const playerService = new PlayerService()
        playerService
          .getMetaData(payload.track.uri)
          .then((track) => {
            playerService.getNowPlaying().then((data) => {
              playerStore.setMetaData(data)
            })
            playerStore.updatePlaying(track)
            emit('track_changed')
          })
          .catch((err) => {
            console.error(err)
          })
      }
      break
    case 'stateChanged':
      playerStore.setPlayingState(!payload.paused)
      break
  }
})
</script>
<script lang="ts">
import { ref } from 'vue'

export default {
  name: 'Player',
  props: {},
  data() {
    return {}
  },
  mounted() {
    this.updateDisplay()
  },
  beforeUnmount() {},
  methods: {
    updateDisplay() {
      const playerService = new PlayerService()
      playerService
        .getStatus()
        .then((state) => {
          const volumeStore = useVolumeStore()
          const playerStore = usePlayerStore()
          if (state.device) {
            volumeStore.setVolume(state.device.volume)
            volumeStore.setLastVolume(state.device.volume)
            playerStore.updateDevice(state.device)
            playerStore.setPlayingState(state.device.playing)
          }
          if (state.track && state.track.uri && state.track.uri.uri != '') {
            playerService
              .getMetaData(state.track.uri)
              .then((track) => {
                playerStore.updatePlaying(track)
              })
              .catch((err) => {
                console.error(err)
              })
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },
    play() {
      const playerStore = usePlayerStore()
      playerStore.setPlayingState(true)
    },
    previousTrack() {
      const playerService = new PlayerService()
      playerService
        .previous()
        .then(() => {
          this.updateDisplay()
        })
        .catch((err) => {
          console.error(err)
        })
    },
    nextTrack() {
      const playerService = new PlayerService()
      playerService
        .next()
        .then(() => {
          this.updateDisplay()
        })
        .catch((err) => {
          console.error(err)
        })
    },
    stopPlayer() {
      const playerService = new PlayerService()
      playerService
        .stop()
        .then(() => {
          this.updateDisplay()
        })
        .catch((err) => {
          console.error(err)
        })
    },
    togglePlayback() {
      const playerService = new PlayerService()
      playerService
        .togglePlayback()
        .then(() => {
          this.updateDisplay()
        })
        .catch((err) => {
          console.error(err)
        })
    },
    muteVolume() {
      const playerService = new PlayerService()
      const volumeStore = useVolumeStore()
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
  },
}
</script>
<template>
  <v-card v-intersect="updateDisplay">
    <div class="pa-5">
      <div>
        <div class="center">
          <div>
            <ScaledImage
              v-if="currentTrack"
              :src="currentTrack.imageUrl"
              size="xxl"
              :responsive="false"
              :matchbackground="true"
            />
          </div>
        </div>
        <h2>
          <span v-if="currentTrack">{{ currentTrack.name }}</span
          ><span v-else>Nothing playing</span>
        </h2>
        <div v-if="currentTrack">
          <div>
            <h4>{{ currentTrack.description }}</h4>
            <h5>{{ currentTrack.subtitle }}</h5>
          </div>
          <div v-if="metaData['icy-title']">Now playing {{ metaData['icy-title'] }}</div>
          <div>
            <h4 v-if="currentTrack.owner">{{ currentTrack.owner.name }}</h4>
            <h5 v-if="currentTrack.artists">{{ currentTrack.artists.join(', ') }}</h5>
          </div>
        </div>
        <div v-else>
          <h4>-</h4>
          <h5>-</h5>
        </div>
        <div>
          <center>
            <table border="0" cellpadding="4" cellspacing="4">
              <tbody>
                <tr>
                  <td>
                    <v-btn
                      color="primary"
                      icon="mdi-skip-previous"
                      variant="outlined"
                      @click="previousTrack()"
                    />
                  </td>
                  <td>
                    <v-btn
                      color="primary"
                      variant="outlined"
                      icon="mdi-stop"
                      @click="stopPlayer()"
                    />
                  </td>
                  <td>
                    <v-btn
                      color="primary"
                      size="x-large"
                      icon="mdi-play"
                      v-if="!playing"
                      @click="togglePlayback()"
                    />
                    <v-btn
                      color="primary"
                      size="x-large"
                      icon="mdi-pause"
                      v-if="playing"
                      @click="togglePlayback()"
                    />
                  </td>
                  <td>
                    <v-btn
                      color="primary"
                      variant="outlined"
                      icon="mdi-skip-next"
                      @click="nextTrack"
                    />
                  </td>
                  <td>
                    <v-btn
                      color="primary"
                      icon="mdi-volume-medium"
                      variant="outlined"
                      v-if="volumeStore.muted"
                      @click="unmuteVolume()"
                    />
                    <v-btn
                      color="primary"
                      icon="mdi-volume-mute"
                      variant="outlined"
                      v-if="!volumeStore.muted"
                      @click="muteVolume()"
                    />
                  </td>
                </tr>
                <tr>
                  <td colspan="5">
                    <VolumeControl />
                  </td>
                </tr>
              </tbody>
            </table>
          </center>
        </div>
      </div>
    </div>
  </v-card>
</template>
<style></style>
