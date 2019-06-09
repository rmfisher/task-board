import React from 'react'
import TaskMenuButton from './TaskMenuButton'
import { Task } from '../../state'
import './Task.scss'

const FADE_IN_DURATION = 260
const FADE_OUT_DURATION = FADE_IN_DURATION + 120

interface TaskProps {
  task: Task
  elementRef: any
  contentRef: any
  dragged: boolean
  onChange: (task: Task) => void
  remove: () => void
}

interface TaskState {
  visible: boolean
  removing: boolean
  height: number | null
}

class TaskComponent extends React.PureComponent<TaskProps, TaskState> {
  public readonly state = { visible: false, removing: false, height: 0 }
  private rootElement!: HTMLDivElement
  private textareaElement: HTMLTextAreaElement | null = null

  public componentDidMount() {
    if (this.props.task.creating) {
      this.fadeIn()
    }
    document.addEventListener('keydown', this.handleDocumentKeyDown, true)
  }

  public componentWillUnmount() {
    document.removeEventListener('keydown', this.handleDocumentKeyDown, true)
  }

  public render() {
    const { task, elementRef, contentRef, dragged } = this.props
    const { visible, removing, height } = this.state
    const style = (task.creating || removing) && height !== null ? { height } : undefined
    this.checkJustDropped()
    return (
      <div
        className={
          'task-container' +
          (removing ? ' removing' : '') +
          (visible ? ' visible' : '') +
          (task.creating ? ' creating' : '') +
          (task.editing ? ' editing' : '') +
          (task.justDropped ? ' just-dropped' : '')
        }
        style={style}
        ref={e => {
          this.rootElement = e as HTMLDivElement
          elementRef(e)
        }}
      >
        <div className="task">
          <div className="task-content" ref={contentRef}>
            <div className="top-container">
              <div className="text-container">
                <div className="description">{task.description}</div>
                {task.editing && (
                  <textarea
                    spellCheck={false}
                    value={task.description}
                    onChange={this.handleTextChange}
                    onKeyPress={this.handleKeyPress}
                    ref={this.handleTextarea}
                    onBlur={this.cancelEdit}
                  />
                )}
              </div>
              <TaskMenuButton
                startEditing={this.startEditing}
                remove={this.fadeOut}
                disabled={dragged || !!task.editing}
              />
            </div>
            {task.userLabel && <div className={'avatar ' + task.userLabel} />}
            {task.labels && task.labels.length > 0 && (
              <div className="labels">
                {task.labels.map(l => (
                  <div key={l.name} className={'label ' + l.color}>
                    {l.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  private handleTextarea = (e: HTMLTextAreaElement | null) => {
    if (this.textareaElement) {
      this.textareaElement.removeEventListener('mousedown', this.stopPropagation)
      this.textareaElement.removeEventListener('mouseup', this.stopPropagation)
    }
    this.textareaElement = e
    if (this.textareaElement) {
      this.textareaElement.addEventListener('mousedown', this.stopPropagation)
      this.textareaElement.addEventListener('mouseup', this.stopPropagation)
      if (!this.props.task.creating) {
        this.textareaElement.focus()
      }
    }
  }

  private handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { task, onChange } = this.props
    const value = e.target.value
    const description = value.endsWith('\n') ? value.substring(0, value.length - 1) : value
    onChange({ ...task, description })
  }

  private handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
      const { task, onChange } = this.props
      onChange({ ...task, editing: false, creating: false })
    }
  }

  private handleDocumentKeyDown = (e: KeyboardEvent) => {
    if ((e.key === 'Escape' || e.keyCode === 27) && this.props.task.editing && !this.state.height) {
      this.cancelEdit()
    }
  }

  private cancelEdit = () => {
    const { task, onChange } = this.props
    const { removing } = this.state
    if (task.creating && !removing) {
      if (!task.description && !task.userLabel && task.labels.length === 0) {
        this.fadeOut()
      } else if (task.editing) {
        onChange({ ...task, editing: false, creating: false })
      }
    } else if (task.editing && !removing) {
      onChange({ ...task, editing: false })
    }
  }

  private fadeIn = () => {
    setTimeout(() => this.setState({ visible: true, height: this.rootElement.scrollHeight }), 1)
    setTimeout(() => {
      if (this.textareaElement) {
        this.textareaElement.focus()
      }
      this.setState({ height: null })
    }, FADE_IN_DURATION)
  }

  private fadeOut = () => {
    this.setState({ height: this.rootElement.clientHeight, removing: true })
    setTimeout(() => {
      this.setState({ visible: false, height: 0 })
      setTimeout(() => {
        this.props.remove()
      }, FADE_OUT_DURATION)
    }, 50)
  }

  private startEditing = () => {
    const { task, onChange } = this.props
    if (!task.editing) {
      onChange({ ...task, editing: true })
    }
  }

  private checkJustDropped = () => {
    const { task, onChange } = this.props
    if (task.justDropped) {
      setTimeout(() => onChange({ ...task, justDropped: false }), 100)
    }
  }

  private stopPropagation = (e: MouseEvent) => e.stopPropagation()
}

export default TaskComponent
