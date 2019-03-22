import React from 'react'
import { Task } from '../../state'
import './Task.scss'

interface TaskProps {
  task: Task
  dragged?: boolean
  x?: number
  y?: number
  width?: number
  height?: number
  rootRef: React.Ref<HTMLDivElement>
}

class TaskComponent extends React.Component<TaskProps> {
  public render() {
    const { task, dragged, x, y, width, height, rootRef } = this.props
    const style = dragged ? { left: x + 'px', top: y + 'px', width: width + 'px', height: height + 'px' } : undefined
    return (
      <div className={'task' + (dragged ? ' dragged' : '')} style={style} ref={rootRef}>
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
