import React from 'react'
import { Task } from '../../state'
import './Task.scss'

interface TaskProps {
  task: Task
  className?: string
  rootRef: React.Ref<HTMLDivElement>
}

const TaskComponent: React.FunctionComponent<TaskProps> = ({ task, rootRef }) => (
  <div className="task" ref={rootRef}>
    <div className="task-content">
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
  </div>
)

export default TaskComponent
