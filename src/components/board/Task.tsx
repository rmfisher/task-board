import React from 'react'
import { Task } from '../../state'
import './Task.scss'

interface TaskProps {
  task: Task
  className?: string
  rootRef: React.Ref<HTMLDivElement>
}

class TaskComponent extends React.Component<TaskProps> {
  private descriptionElement!: HTMLDivElement

  public componentDidMount() {
    this.descriptionElement.addEventListener('mousedown', this.handleDescriptionMouseDown)
  }

  public componentWillUnmount() {
    this.descriptionElement.removeEventListener('mousedown', this.handleDescriptionMouseDown)
  }

  public render() {
    const { task, rootRef } = this.props
    return (
      <div className="task" ref={rootRef}>
        <div className="task-content">
          <div className="description" ref={e => (this.descriptionElement = e as HTMLDivElement)}>
            {task.description}
          </div>
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
  }

  private handleDescriptionMouseDown = (e: MouseEvent) => {
    e.stopPropagation() // Prevents task drag when clicking on description text and allows text selection.
  }
}

export default TaskComponent
