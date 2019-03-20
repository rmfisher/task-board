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
  users: [{ id: '1', label: 'sorcerio' }, { id: '2', label: 'bean' }, { id: '3', label: 'elfo' }],
  categories: [
    { id: '1', label: 'Backlog', tasks: [] },
    { id: '2', label: 'Ready', tasks: [] },
    { id: '3', label: 'In Progress', tasks: [] },
    { id: '4', label: 'Done', tasks: [] },
  ],
}
