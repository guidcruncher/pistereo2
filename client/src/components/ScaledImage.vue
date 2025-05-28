<script lang="ts">
import { ref } from 'vue'

export default {
  name: 'ScaledImage',
  props: {
    src: {
      type: String,
      required: true,
      default: '/android-chrome-512x512-trans.png',
    },
    size: {
      type: String,
      required: true,
    },
    responsive: {
      type: Boolean,
      required: false,
      default: true,
    },
    matchbackground: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data() {
    return { derivedClass: '', ready: false }
  },
  mounted() {
    this.derivedClass = 'scaled-img scaled-img-' + this.size
    if (!this.responsive) {
      this.derivedClass = 'scaled-img scaled-img-' + this.size + '-static'
    }
  },
  beforeUnmount() {},
  methods: {
    proxy(url: string) {
      if (!url || url === '') {
        return '/android-chrome-512x512-trans.png'
      }

      if (url.startsWith('/')) {
        return url
      }

      const params = new URLSearchParams()
      params.append('u', url)
      return '/api/p?' + params.toString()
    },
    setBgColor(ev: Event) {
      const rgbToHex = function (r: number, g: number, b: number) {
        if (r > 255 || g > 255 || b > 255) {
          return ''
        }

        return ((r << 16) | (g << 8) | b).toString(16)
      }

      const srcImg = ev.target as HTMLImageElement
      const target = srcImg ? srcImg.parentElement : null
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(srcImg, 0, 0)
        const p = ctx.getImageData(0, 0, 1, 1).data
        let hex = '#' + ('000000' + rgbToHex(p[0], p[1], p[2])).slice(-6)

        if (p.length > 3) {
          const alpha = p[3]
          if (alpha == 0) {
            hex = '#ffffff'
            1
          }
        }

        if (target) {
          target.style.background = hex
        }
      }
    },
    sniffBgColor(ev: Event) {
      if (this.matchbackground) {
        this.setBgColor(ev)
      }
      this.ready = true
    },
  },
}
</script>
<template>
  <div :class="derivedClass"><span /><img :src="proxy(src)" @load="sniffBgColor($event)" /></div>
</template>
<style></style>
