<script setup lang="ts">
import type { TodoPost } from '@/types'
import { ref } from 'vue'

const titleModel = ref('')
const contextModel = ref('')

const titleError = ref<boolean>(false)
const contextError = ref<boolean>(false)

const props = defineProps<{
  onAdd: (todo: TodoPost) => void
}>()

function handleSubmit() {
  let isError = false
  if (titleModel.value.trim().length === 0) {
    titleError.value = true
    isError = true
  } else {
    titleError.value = false
  }
  if (contextModel.value.trim().length === 0) {
    contextError.value = true
    isError = true
  } else {
    contextError.value = false
  }

  if (!isError && titleModel.value && contextModel.value) {
    const todo: TodoPost = {
      title: titleModel.value,
      context: contextModel.value,
      checked: false,
    }

    props.onAdd(todo)
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <label for="todo-title">Todo title</label>
    <input type="text" id="todo-title" v-model="titleModel" />
    <span v-show="titleError" class="error-text">Invalid title</span>
    <label for="todo-context">Todo context</label>
    <input type="text" id="todo-context" v-model="contextModel" />
    <p v-if="contextError" class="error-text">Invalid context</p>

    <button type="submit">Add todo</button>
  </form>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.error-text {
  display: inline;
  color: red;
}

button {
  margin: 10px;
  padding: 10px 20px;
}
</style>
