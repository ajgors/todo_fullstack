import { apiUrl, jsonHeaders } from '@/api'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { type User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoggedIn = computed(() => !!user.value)

  async function login(username: string, password: string) {
    const response = await fetch(apiUrl + 'login', {
      method: 'POST',
      credentials: 'include',
      headers: jsonHeaders,
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })

    if (!response.ok) throw new Error('Login failed')
    //fetch loged user data
    await fetchUser()
  }

  async function fetchUser() {
    console.log('Fetching user')
    try {
      const response = await fetch(apiUrl + 'users', { credentials: 'include' })
      if (response.ok) {
        user.value = await response.json()
      } else {
        user.value = null
      }
    } catch (error) {
      console.log('fetch user error', error)
      user.value = null
    }
  }

  return { user, isLoggedIn, login, fetchUser }
})
