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
  <v-row>
    <v-col cols="10">
      <v-text-field v-model="text" label="Speak" @keyup.enter="speak()"></v-text-field> </v-col
    ><v-col cols="2">
      <v-btn icon="mdi-chat" @click="speak()" :disabled="text == ''"></v-btn> </v-col
  ></v-row>
</template>
<style></style>
