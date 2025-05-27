<script lang="ts" setup></script>
<script lang="ts">
import { PlayerService } from '@/services/player.service'
import { on, emit, off } from '@/composables/useeventbus'

export default {
  name: 'Mixer',
  props: {},
  data() {
    return {}
  },
  mounted() {
    const playerService = new PlayerService()
  },
  beforeUnmount() {},
  methods: {},
}
</script>
<template></template>
<style></style>
