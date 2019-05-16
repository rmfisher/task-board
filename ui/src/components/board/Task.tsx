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
  private textareaElement: HTMLTextAreaElement | null = null

  public componentDidMount() {
    if (this.props.task.creating) {
      this.fadeIn()
      this.rootElement.addEventListener(
        'transitionend',
        () => {
          if (this.textareaElement) {
            this.textareaElement.focus()
          }
        },
        { once: true }
      )
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
            {task.editing ? (
              <textarea spellCheck={false} ref={this.handleTextareaElementSet} />
            ) : (
              <div className="description">{task.description}</div>
            )}
            {task.userLabel && <div className={'avatar ' + task.userLabel} />}
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

  private handleTextareaElementSet = (e: HTMLTextAreaElement) => {
    if (this.textareaElement) {
      this.textareaElement.removeEventListener('mousedown', this.stopPropagation)
    }
    this.textareaElement = e
    if (this.textareaElement) {
      this.textareaElement.addEventListener('mousedown', this.stopPropagation)
    }
  }

  private stopPropagation = (e: MouseEvent) => e.stopPropagation()
}

export default TaskComponent
