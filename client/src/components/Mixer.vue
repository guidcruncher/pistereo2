<script lang="ts" setup></script>
<script lang="ts">
import { PlayerService } from '@/services/player.service'
import { on, emit, off } from '@/composables/useeventbus'

export default {
  name: 'Mixer',
  props: {},
  data() {
    return {mixer:{}, hasData:  false}
  },
  mounted() {
    const playerService = new PlayerService()
    loadMixer()
  },
  beforeUnmount() {},
  methods: {
    loadMixer() {
      const playerService = new PlayerService()
      playerService.getMixer("equal").then((data)=>{ 
         this.mixer = data
         this.hasData = true
       })
    },
    saveMixer()  {
       const playerService = new PlayerService()
      playerService.updateMixer("equal", this.mixer)
    },
    setEqualiser(item) {

     }
  },
}
</script>
<template>
<v-slide-group show-arrows v-if="hasData">
      <v-slide-group-item
        v-for="item in mixer.frequencies"
        :key="item"
        v-slot="{ isSelected, toggle }"
        :value="item"
      >
        <v-slider
          v-model="item.channels[0]"
          direction="vertical"
          min="item.min"
          max="item.max"
          step="item.steps"
          @end="setEqualiser(item)"
        >
          <template #label>
            <div class="text-caption">
              {{ item.title }}
            </div>
          </template>
        </v-slider>
      </v-slide-group-item>
    </v-slide-group>
</template>
<style></style>
