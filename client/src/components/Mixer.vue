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
    return { mixer: {} as any, hasData: false }
  },
  mounted() {
    const playerService = new PlayerService()
    const mixerStore = useMixerStore()

    playerService
      .getUserSettings()
      .then((settings) => {
        if (settings['mixer.locked']) {
          mixerStore.setLocked(settings['mixer.locked'])
        }
        if (settings['mixer.simple']) {
          mixerStore.setSimple(settings['mixer.simple'])
        }
        if (settings['mixer.draglock']) {
          mixerStore.setDragLocked(settings['mixer.draglock'])
        }

        this.loadMixer()
      })
      .catch((err) => {
        console.error('Error loading user settings:', err)
        this.loadMixer()
      })
  },
  beforeUnmount() {},
  methods: {
    updateSetting(key, value) {
      const playerService = new PlayerService()
      playerService
        .saveUserSetting(key, value)
        .then(() => {})
        .catch((err) => {
          console.error(`Error updating setting ${key}:`, err)
        })
    },
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
    saveMixerChannel(item, index) {
      const playerService = new PlayerService()
      playerService.updateMixerChannel('equal', item, index)
    },
    setEqualiser(item, index) {
      const mixerStore = useMixerStore()
      if (mixerStore.draglock) {
        this.setAll(item.value)
        this.saveMixer()
      } else {
        if (mixerStore.simple) {
          item.channels.forEach((c) => {
            c.value = item.value
          })
        }
        this.saveMixer()
      }
    },
    resetAll() {},
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
          v-if="mixerStore.simple"
          v-for="item in mixer.frequencies"
          :key="item"
          v-slot="{ isSelected, toggle }"
          :value="item"
        >
          <v-slider
            :disabled="mixerStore.locked"
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
      <v-btn @click="resetAll()">Reset</v-btn>

      <v-switch
        v-model="mixerStore.locked"
        hide-details
        label="Locked"
        update:modelValue="updateSetting('mixer.locked', mixerStore.locked)"
      ></v-switch>

      <v-switch
        v-model="mixerStore.simple"
        label="Simple mode"
        hide-details
        update:modelValue="updateSetting('mixer.simple', mixerStore.simple)"
      ></v-switch>

      <v-switch
        v-model="mixerStore.draglock"
        label="Drag Sync"
        hide-details
        update:modelValue="updateSetting('mixer.draglock', mixerStore.draglock)"
      ></v-switch>
    </v-card-actions>
  </v-card>
</template>
<style></style>
