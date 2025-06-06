<script lang="ts" setup></script>
<script lang="ts">
import { PlayerService } from '@/services/player.service'
import { on, emit, off } from '@/composables/useeventbus'

export default {
  name: 'Presets',
  props: {},
  data() {
    return { presets: [] as any[] }
  },
  mounted() {
    const playerService = new PlayerService()
    playerService
      .getPresets()
      .then((value) => {
        this.presets = value
      })
      .catch((err) => {
        console.error(err)
      })
  },
  beforeUnmount() {},
  methods: {
    play(item) {
      const playerService = new PlayerService()
      playerService.play(item.uri)
    },
    addPreset(uri) {
      const playerService = new PlayerService()
      playerService.addPreset(uri)
    },
  },
}
</script>

<template>
  <v-card>
    <v-slide-group show-arrows>
      <v-slide-group-item
        v-for="(item, index) in presets"
        :key="item"
        v-slot="{ isSelected, toggle }"
      >
        <div class="pa-1">
          <ScaledImage :src="item.imageUrl" size="sm" @click="play(item)" responsive="false" />
        </div>
      </v-slide-group-item>
    </v-slide-group>
  </v-card>
</template>
<style></style>
