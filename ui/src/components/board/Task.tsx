import React from 'react'
import { Task } from '../../state'
import './Task.scss'

interface TaskProps {
  task: Task
  className?: string
  rootRef: React.Ref<HTMLDivElement>
}

class TaskComponent extends React.PureComponent<TaskProps> {
  private rootElement!: HTMLDivElement

  public componentDidMount() {
    if (this.props.task.creating) {
      this.fadeIn()
    }
  }

  public render() {
    const { task, rootRef } = this.props
    const refFunc = rootRef as any
    return (
      <div
        className="task-container"
        ref={e => {
          this.rootElement = e as HTMLDivElement
          refFunc(e)
        }}
      >
        <div className="task">
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
      </div>
    )
  }

  private fadeIn() {
    this.rootElement.style.height = '0'
    this.rootElement.classList.add('creating')
    this.rootElement.classList.add('zero-height')
    setTimeout(() => {
      this.rootElement.style.height = this.rootElement.scrollHeight + 'px'
      this.rootElement.classList.remove('zero-height')
    }, 1)
  }
}

export default TaskComponent
