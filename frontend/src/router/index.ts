import { createRouter, createWebHistory } from 'vue-router'
import TodoView from '../views/TodoView.vue'
import LoginView from '@/views/LoginView.vue'
import { useAuthStore } from '@/store/userStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'todo',
      component: TodoView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()
  await auth.fetchUser()
  if (!auth.isLoggedIn && to.path !== '/login') {
    next('/login')
  } else if (auth.isLoggedIn && to.path === '/login') {
    next('/')
  } else {
    next()
  }
})

export default router
