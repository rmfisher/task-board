import React from 'react'
import { Task } from '../../state'
import './Task.scss'

interface TaskProps {
  rootRef: React.Ref<HTMLDivElement>
  task: Task
}

class TaskComponent extends React.Component<TaskProps> {
  public render() {
    const { task, rootRef } = this.props
    return (
      <div className="task" ref={rootRef}>
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
  }
}

export default TaskComponent
