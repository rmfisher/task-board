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
  labels: Label[]
  userLabel?: string
  creating?: boolean
  editing?: boolean
  justDropped?: boolean
}

export interface Label {
  name: string
  color: string
}

export * from './initialState'
