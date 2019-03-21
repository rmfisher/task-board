export interface State {
  users: User[]
  categories: Category[]
}

export interface User {
  id: string
  label: string
}

export interface Category {
  id: string
  label: string
  tasks: Task[]
}

export interface Task {
  id: string
  description: string
  userLabel: string
  labels: Label[]
}

export interface Label {
  name: string
  color: string
}
