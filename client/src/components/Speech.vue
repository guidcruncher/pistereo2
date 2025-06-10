<script lang="ts">
import { PlayerService } from '../services/player.service'

export default {
  name: 'Speech',
  data() {
    return { text: '' }
  },
  mounted() {},
  beforeUnmount() {},
  methods: {
    speak() {
      const playerService = new PlayerService()
      playerService.speak('en', this.text)
    },
  },
}
</script>
<template>
  <v-text-field v-model="text" label="Speak" @keyup.enter="speak()"></v-text-field>
  <v-btn icon="mdi-magnify" @click="speak()" :disabled="text == ''"></v-btn>
</template>
<style></style>
