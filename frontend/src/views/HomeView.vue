<script setup lang="ts">
import HelloWorld from '@/components/HelloWorld.vue'
import { computed, onMounted, ref } from 'vue'
import { apiUrl } from '@/api'

const status = ref<string | undefined>(undefined)

onMounted(async () => {
  try {
    const result = await fetch(apiUrl + 'status')
    const data = await result.json()
    status.value = data
  } catch (error) {
    console.log(error)
  }
})

const statusMessage = computed(() => {
  return status.value ?? 'Db status is unknown'
})
</script>

<template>
  <main>
    <HelloWorld msg="home page" />
    <h2>{{ statusMessage }}</h2>
  </main>
</template>
