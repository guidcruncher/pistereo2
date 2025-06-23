<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { theme } = storeToRefs(userStore)
</script>

<script lang="ts">
export default {
  name: 'App',
  data() {
    return {}
  },
  mounted() {},
  beforeUnmount() {},
  methods: {},
}
</script>

<template>
  <v-app :theme="theme">
    <router-view />
  </v-app>
</template>

<script lang="ts"></script>

<style scoped></style>
