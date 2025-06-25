<script lang="ts">
export default {
  name: 'Clock',
  data() {
    return {
      date: '',
      time: '',
      timer: 0,
    }
  },
  mounted() {
    this.tick()
    this.timer = setInterval(() => {
      this.tick()
    }, 1000)
  },
  beforeUnmount() {
    clearInterval(this.timer)
    this.timer = 0
  },
  methods: {
    tick() {
      const date = new Date()
      let changed = false
      const dateFormat = new Intl.DateTimeFormat('default', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      const timeFormat = new Intl.DateTimeFormat('default', {
        hour: 'numeric',
        minute: 'numeric',
        hourCycle: 'h23',
      })
      if (this.date != dateFormat.format(date)) {
        changed = true
        this.date = dateFormat.format(date)
      }

      if (this.time != timeFormat.format(date)) {
        changed = true
        this.time = timeFormat.format(date)
      }

      if (changed) {
      }
    },
  },
}
</script>

<template>
  <div class="text-h1 text-center font-weight-thin">
    {{ time }}
  </div>
  <div class="text-subtitle-1 text-center text-uppercase">
    {{ date }}
  </div>
</template>
