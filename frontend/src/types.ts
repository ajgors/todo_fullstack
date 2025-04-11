export type User = {
  id: string
  username: string
}

export type Todo = {
  id: string
  user_id: string
  title: string
  context: string
  checked: boolean
}

export type TodoPost = {
  title: string
  context: string
  checked: boolean
}
