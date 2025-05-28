<script lang="ts" setup></script>
<script lang="ts">
import { PlayerService } from '@/services/player.service'
import { on, emit, off } from '@/composables/useeventbus'

export default {
  name: 'Mixer',
  props: {},
  data() {
    return { mixer: {} as any, hasData: false, mode: 'simple' }
  },
  mounted() {
    const playerService = new PlayerService()ttt"sßssssssxx%-•%-%
    this.loadMixer()
  },
  beforeUnmount() {},
  methods: {
    loadMixer() {
      const playerService = new PlayerService()
      playerService.getMixer('equal').then((data) => {
        this.mixer = data
        this.hasData = true
      })
    },
    saveMixer() {
      const playerService = new PlayerService()
      playerService.updateMixer('equal', this.mixer)
    },
    setEqualiser(item, index) {
      if (this.mode == 'simple') {
        for (let i = 0; i < item.channels.length; i++) {
          item.channels[i].value = item.value
        }
      } else {
        //
      }

      this.saveMixer()
    },
    updateColor(ctl, item) {
      if (item.value < 50) {
        ctl.color = 'green'
      }
    },
  },
}
</script>
<template>
  <v-card>
    <v-slide-group show-arrows v-if="hasData">
      <v-slide-group-item
        v-for="item in mixer.frequencies"
        :key="item"
        v-slot="{ isSelected, toggle }"
        :value="item"
      >
        <div v-if="mode == 'simple'">
          <v-slider
            v-model="item.value"
            direction="vertical"
            :min="item.min"
            :max="item.max"
            :step="item.steps"
            @end="setEqualiser(item, -1)"
          >
            <template #label>
              <div class="text-caption">{{ item.title }} {{ item.value }}</div>
            </template>
          </v-slider>
        </div>
        <div v-else>
          {{ item.channels[0].name }}
          <v-slider
            v-model="item.channels[0].value"
            direction="vertical"
            :min="item.min"
            :max="item.max"
            :step="item.steps"
            @end="setEqualiser(item, 0)"
          >
            <template #label>
              <div class="text-caption">{{ item.title }} {{ item.value }}</div>
            </template>
          </v-slider>

          {{ item.channels[1].name }}
          <v-slider
            v-model="item.channels[1].value"
            direction="vertical"
            :min="item.min"
            :max="item.max"
            :step="item.steps"
            @end="setEqualiser(item, 1)"
          >
            <template #label>
              <div class="text-caption">{{ item.title }} {{ item.value }}</div>
            </template>
          </v-slider>
        </div>
      </v-slide-group-item>
    </v-slide-group>
  </v-card>
</template>
<style></style>
