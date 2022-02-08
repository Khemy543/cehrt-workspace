const widgetData = [
  {
    icon: 'grid',
    value: 210,
    text: 'Total Tasks',
  },
  {
    icon: 'check-square',
    value: 121,
    text: 'Total Tasks Completed',
  },
  {
    icon: 'clock',
    value: 2500,
    text: 'Total Pending Task',
  },
  {
    icon: 'users',
    value: 12,
    text: 'Total Assignees',
  },
]

const projectActivity = [
  {
    id: 1,
    title: 'Inception Report',
    status: 'Pending',
    task:4
  },
  {
    id: 2,
    title: 'Scopping Report',
    text: 'Ut enim ad minima veniam quis velit',
    color: 'success',
    status: 'Completed',
    task:4
  },
  {
    id: 3,
    avatar: '08',
    title: 'Richard',
    text: 'Quis autem vel eum iure',
    color: 'warning',
    status: 'Pending',
    task:4
  },
  {
    id: 4,
    avatar: '08',
    title: 'Jery',
    text: 'Quis autem vel eum iure',
    color: 'info',
    status: 'Completed',
    task:4
  }
]

export { widgetData, projectActivity }
