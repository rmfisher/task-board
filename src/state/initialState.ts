import { State } from '.'

export const initialState: State = {
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
    {
      id: '2',
      label: 'Ready',
      tasks: [
        {
          id: '1',
          description: 'Clicking on "learn more" generates error message',
          userLabel: 'sorcerio',
          labels: [{ name: 'Medium', color: 'orange' }, { name: 'All', color: 'yellow' }],
        },
        {
          id: '2',
          description: "Login button doesn't work on mobile",
          userLabel: 'sorcerio',
          labels: [{ name: 'Medium', color: 'orange' }],
        },
        {
          id: '3',
          description: 'iOS app crashing',
          userLabel: 'bean',
          labels: [{ name: 'High', color: 'red' }],
        },
      ],
    },
    { id: '3', label: 'In Progress', tasks: [] },
    { id: '4', label: 'Done', tasks: [] },
  ],
}
