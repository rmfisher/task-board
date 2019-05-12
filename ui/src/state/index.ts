export interface State {
  users: User[]
  columns: Column[]
}

export interface User {
  id: string
  label: string
}

export interface Column {
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

export * from './initialState'
