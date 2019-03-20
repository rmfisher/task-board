import React from 'react'
import { Task } from '../../state/state'
import './Task.scss'

interface TaskProps {
  task: Task
}

const TaskComponent: React.FunctionComponent<TaskProps> = ({ task }) => (
  <div className="task">
    <div className="description">{task.description}</div>
    <div className={'avatar ' + task.userLabel} />
    <div className="labels">
      {task.labels.map(l => (
        <div key={l.name} className={'label ' + l.color}>
          {l.name}
        </div>
      ))}
    </div>
  </div>
)

export default TaskComponent
