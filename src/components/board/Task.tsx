import React from 'react'
import { Task } from '../../state'
import './Task.scss'

interface TaskProps {
  task: Task
  dragged?: boolean
  rootRef: React.Ref<HTMLDivElement>
}

class TaskComponent extends React.Component<TaskProps> {
  public render() {
    const { task, dragged, rootRef } = this.props
    return (
      <div className={'task' + (dragged ? ' dragged' : '')} ref={rootRef}>
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
