import { initialState } from './initialState'

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

export interface DragState {
  sourceCategoryId: string
  sourceTaskId: string
  sourceTaskIndex: number
  sourceTaskHeight: number
  sourceCollapseStarted: boolean
  hoverCategoryId?: string
  hoverTaskIndex?: number
  hoverExpandStarted: boolean
}

export * from './initialState'
