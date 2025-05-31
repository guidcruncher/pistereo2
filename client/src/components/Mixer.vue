<script lang="ts" setup>
import { useMixerStore } from '@/stores/mixer'

const mixerStore = useMixerStore()
</script>
<script lang="ts">
import { PlayerService } from '@/services/player.service'
import { on, emit, off } from '@/composables/useeventbus'

export default {
  name: 'Mixer',
  props: {},
  data() {
    return { mixer: {} as any, hasData: false}
  },
  mounted() {
    const playerService = new PlayerService()
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
const mixerStore = useMixerStore()
      if (mixerStore.draglock) {
        this.setAll(item.value)
      } else {
        if (this.mode == 'simple') {
          item.channels.forEach((c) => {
            c.value = item.value
          })
        }
      }

      this.saveMixer()
    },
    setAll(level) {
      this.mixer.frequencies.forEach((f) => {
        f.channels.forEach((c) => {
          c.value = level
        })
        f.value = level
      })
      this.saveMixer()
    },
  },
}
</script>
<template>
  <v-card>
    <v-card-item>
      <v-card-title>Mixer </v-card-title>
      <v-card-subtitle></v-card-subtitle>
    </v-card-item>
    <v-card-text>
      <v-slide-group show-arrows v-if="hasData">
        <v-slide-group-item
          v-if="mode == 'simple'"
          v-for="item in mixer.frequencies"
          :key="item"
          v-slot="{ isSelected, toggle }"
          :value="item"
        >
          <v-slider
            :disabled="locked"
            v-model="item.value"
            direction="vertical"
            :min="item.min"
            :max="item.max"
            :step="item.steps"
            @end="setEqualiser(item, -1)"
          >
            <template #label>
              <div class="text-caption">{{ item.title }}</div>
            </template>
          </v-slider>
        </v-slide-group-item>
        <v-slide-group-item
          v-if="!mixerStore.simple"
          v-for="item in mixer.frequencies"
          :key="item"
          v-slot="{ isSelected, toggle }"
          :value="item"
        >
          <div v-for="ch in item.channels" class="pa-2">
            <v-slider
              v-model="ch.value"
              direction="vertical"
              :min="item.min"
              :max="item.max"
              :step="item.steps"
              :disabled="mixerStore.locked"
              @end="setEqualiser(item, -1)"
            >
              <template #label>
                <div class="text-caption">{{ ch.name }} {{ item.title }}</div>
              </template>
            </v-slider>
          </div>
        </v-slide-group-item>
      </v-slide-group>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="setAll(50)">Reset</v-btn>

      <v-switch v-model="mixerStore.locked" hide-details label="Locked"></v-switch>

      <v-switch
        v-model="mixerStore.èmode"
        label="Advanced mode"
        hide-details
      ></v-switch>

      <v-switch v-model="mixerStore.draglock" label="Drag Sync" hide-details></v-switch>
    </v-card-actions>
  </v-card>
</template>
<style></style>
