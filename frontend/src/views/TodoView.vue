<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { apiUrl } from '@/api'
import { useAuthStore } from '@/store/userStore'
import type { Todo, TodoPost } from '@/types'
import TodoItem from '@/components/TodoItem.vue'
import AddTodo from '@/components/AddTodo.vue'
import { jsonHeaders } from '../api'

let todos = ref<Todo[]>([])

type Data = {
  todos: Todo[]
}

onMounted(async () => {
  try {
    //fetch todos
    const response = await fetch(apiUrl + 'todos', { credentials: 'include' })
    const data: Data = await response.json()
    todos.value.push(...data.todos)
  } catch (error) {
    console.log(error)
  }
})

async function checkTodo(todo: Todo) {
  //save to db checked todo
  //TODO need todo patch on backend
}

async function deleteTodo(todo: Todo) {
  try {
    const response = await fetch(`${apiUrl}todos/${todo.id}`, {
      credentials: 'include',
      method: 'DELETE',
    })

    const data = null

    if (response.status === 400) {
      //validation error
      console.log('Wrong todo id', data)
    } else if (response.status === 500) {
      //server error
      console.log('Server error', data)
    }

    if (response.ok) {
      //deleted properly
      todos.value = todos.value.filter((t) => t.id !== todo.id)
    }
  } catch (error) {
    console.log(error)
  }
}

async function addTodo(todo: TodoPost) {
  console.log(todo)
  try {
    const response = await fetch(`${apiUrl}todos`, {
      credentials: 'include',
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({
        title: todo.title,
        context: todo.context,
        checked: todo.checked,
      }),
    })

    const data = await response.json()

    if (response.status === 400) {
      //validation error
      console.log('Validation error', data)
    } else if (response.status === 500) {
      //server error
      console.log('Server error', data)
    }

    if (response.ok) {
      //add todo to list
      todos.value.push(data)
    }
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <main>
    <div>
      <ul>
        <TodoItem
          v-for="todo in todos"
          :key="todo.id"
          :data="todo"
          :onCheck="
            (v) => {
              todo.checked = v
              checkTodo(todo)
            }
          "
          :onDelete="() => deleteTodo(todo)"
        />
      </ul>
      <AddTodo :onAdd="(todo: TodoPost) => addTodo(todo)" />
    </div>
  </main>
</template>

<style scoped>
ul {
  list-style: none;
  margin-bottom: 30px;
}
</style>
