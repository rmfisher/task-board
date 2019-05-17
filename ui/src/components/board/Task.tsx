import React from 'react'
import { Task } from '../../state'
import './Task.scss'

const FADE_IN_DURATION = 260
const FADE_OUT_DURATION = FADE_IN_DURATION + 120

interface TaskProps {
  task: Task
  rootRef: React.Ref<HTMLDivElement>
  remove: () => void
}

interface TaskState {
  created: boolean
}

class TaskComponent extends React.PureComponent<TaskProps, TaskState> {
  public readonly state = { created: false }
  private rootElement!: HTMLDivElement
  private textareaElement: HTMLTextAreaElement | null = null

  public componentDidMount() {
    if (this.props.task.creating) {
      setTimeout(() => this.setState({ created: true }), 1)
      setTimeout(() => {
        if (this.textareaElement) {
          this.textareaElement.focus()
        }
      }, FADE_IN_DURATION)
    }
  }

  public render() {
    const { task, rootRef } = this.props
    const { created } = this.state
    const style = task.creating ? { height: created ? this.rootElement.scrollHeight : 0 } : undefined
    const refFunc = rootRef as any
    return (
      <div
        className={
          'task-container' +
          (task.creating ? ' creating' : '') +
          (created ? ' created' : '') +
          (task.editing ? ' editing' : '')
        }
        style={style}
        ref={e => {
          this.rootElement = e as HTMLDivElement
          refFunc(e)
        }}
      >
        <div className="task">
          <div className="task-content">
            {task.editing ? (
              <textarea spellCheck={false} ref={this.handleTextareaSet} onBlur={this.handleBlur} />
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

  private fadeOut() {
    this.setState({ created: false })
    setTimeout(() => {
      this.props.remove()
    }, FADE_OUT_DURATION)
  }

  private handleTextareaSet = (e: HTMLTextAreaElement) => {
    if (this.textareaElement) {
      this.textareaElement.removeEventListener('mousedown', this.stopPropagation)
    }
    this.textareaElement = e
    if (this.textareaElement) {
      this.textareaElement.addEventListener('mousedown', this.stopPropagation)
    }
  }

  private handleBlur = () => {
    if (this.props.task.creating && !this.props.task.description) {
      this.fadeOut()
    }
  }

  private stopPropagation = (e: MouseEvent) => e.stopPropagation()
}

export default TaskComponent
