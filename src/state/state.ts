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
  userId: string
  labels: Label[]
}

export interface Label {
  id: string
  name: string
  color: string
}

export const initialState = {
  users: [{ id: '1', label: 'sorcerio' }, { id: '2', label: 'elfo' }, { id: '3', label: 'bean' }],
  categories: [
    { id: '1', label: 'Backlog', tasks: [] },
    { id: '1', label: 'Ready', tasks: [] },
    { id: '1', label: 'In Progress', tasks: [] },
    { id: '1', label: 'Done', tasks: [] },
  ],
}
