import { State } from '.'

export const initialState: State = {
  users: [{ id: '1', label: 'sorcerio' }, { id: '2', label: 'bean' }, { id: '3', label: 'elfo' }],
  columns: [
    {
      id: 'c1',
      label: 'Backlog',
      tasks: [
        {
          id: 't1',
          description: 'Font size is too small in registration form',
          userLabel: 'sorcerio',
          labels: [{ name: 'Low', color: 'green' }, { name: 'All', color: 'yellow' }],
        },
        {
          id: 't2',
          description: 'Local storage is not cleaned up on logout',
          userLabel: 'bean',
          labels: [{ name: 'Medium', color: 'orange' }, { name: 'Chrome', color: 'lime' }],
        },
        {
          id: 't3',
          description: "Login doesn't work if third-party cookies are disabled",
          userLabel: 'sorcerio',
          labels: [{ name: 'Low', color: 'green' }, { name: 'IE', color: 'blue' }],
        },
      ],
    },
    {
      id: 'c2',
      label: 'Ready',
      tasks: [
        {
          id: 't4',
          description: 'Items are missing from search results when filtering by date',
          userLabel: 'sorcerio',
          labels: [{ name: 'Medium', color: 'orange' }, { name: 'All', color: 'yellow' }],
        },
        {
          id: 't5',
          description: 'Link clicks cause a full page reload',
          userLabel: 'sorcerio',
          labels: [{ name: 'Medium', color: 'orange' }],
        },
      ],
    },
    {
      id: 'c3',
      label: 'In Progress',
      tasks: [
        {
          id: 't6',
          description: 'Apple Pay integration is broken on iOS',
          userLabel: 'bean',
          labels: [{ name: 'High', color: 'red' }],
        },
      ],
    },
    { id: 'c4', label: 'Done', tasks: [] },
  ],
}
