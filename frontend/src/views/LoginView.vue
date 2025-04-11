<script setup lang="ts">
import { apiUrl, jsonHeaders } from '@/api'
import { ref } from 'vue'
import { useAuthStore } from '@/store/userStore'
import { useRouter } from 'vue-router'

const usernameModel = defineModel<string>('username')
const passwordModel = defineModel<string>('password')
const loginError = ref(false)

const auth = useAuthStore()
const router = useRouter()

async function login() {
  if (usernameModel.value && passwordModel.value) {
    try {
      await auth.login(usernameModel.value, passwordModel.value)
      router.push('/')
    } catch (error) {
      loginError.value = true
      console.log(error)
    }
  } else {
    loginError.value = true
  }
}
</script>

<template>
  <div>
    <form @submit.prevent="login">
      <label for="username">Username</label>
      <input type="text" id="username" v-model="usernameModel" placeholder="Usernanme" />
      <label for="password">Password</label>
      <input type="password" id="password" v-model="passwordModel" placeholder="Password" />
      <button type="submit">Login</button>
    </form>

    <h2 v-if="loginError">Bad credentials</h2>
  </div>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

button {
  margin: 15px;
  padding: 10px 20px;
}

label {
  margin-top: 10px;
}

h2 {
  text-align: center;
}
</style>
