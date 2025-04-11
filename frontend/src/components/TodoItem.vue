<script setup lang="ts">
import type { Todo } from '@/types'
const props = defineProps<{
  data: Todo
  onCheck: (isChecked: boolean) => void
  onDelete: () => void
}>()
</script>

<template>
  <li>
    <h2>{{ props.data.title }}</h2>
    <div class="context">
      <p>{{ props.data.context }}</p>
      <input
        type="checkbox"
        :checked="props.data.checked"
        @change="
          (ev: Event) => {
            const target = ev.currentTarget as HTMLInputElement
            onCheck(target.checked)
          }
        "
      />

      <button @click="onDelete">X</button>
    </div>
  </li>
</template>

<style scoped>
p {
  display: inline;
  margin-right: 5px;
}

li > h2 {
  text-align: center;
  margin-top: 20px;
}

.context {
  display: flex;
  justify-content: center;
}

button {
  margin: 5px;
  background-color: #cc0000;
  border: none;
  color: white;
}
</style>
