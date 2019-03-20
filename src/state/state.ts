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

export const initialState = {
  users: [{ id: '1', label: 'sorcerio' }, { id: '2', label: 'bean' }, { id: '3', label: 'elfo' }],
  categories: [
    {
      id: '1',
      label: 'Backlog',
      tasks: [
        {
          id: '1',
          description: "Undo function doesn't always work",
          userLabel: 'sorcerio',
          labels: [{ name: 'Low', color: 'green' }, { name: 'All', color: 'yellow' }],
        },
        {
          id: '2',
          description: 'Search is displaying incorrect results',
          userLabel: 'bean',
          labels: [{ name: 'Medium', color: 'orange' }, { name: 'Chrome', color: 'lime' }],
        },
        {
          id: '3',
          description: 'Spacing in top bar is off',
          userLabel: 'sorcerio',
          labels: [{ name: 'Low', color: 'green' }, { name: 'IE', color: 'blue' }],
        },
        {
          id: '4',
          description: 'Landing page has a typo',
          userLabel: 'elfo',
          labels: [{ name: 'Medium', color: 'orange' }, { name: 'All', color: 'yellow' }],
        },
      ],
    },
    { id: '2', label: 'Ready', tasks: [] },
    { id: '3', label: 'In Progress', tasks: [] },
    { id: '4', label: 'Done', tasks: [] },
  ],
}
