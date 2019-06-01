import React from 'react'
import { Task } from '../../state'
import EditIcon from '../../assets/icons/EditIcon'
import AssignmentIndIcon from '../../assets/icons/AssignmentIndIcon'
import LocalOfferIcon from '../../assets/icons/LocalOfferIcon'
import CloseIcon from '../../assets/icons/CloseIcon'
import './Task.scss'

const FADE_IN_DURATION = 260
const FADE_OUT_DURATION = FADE_IN_DURATION + 120

interface TaskProps {
  task: Task
  elementRef: any
  contentRef: any
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
  private buttonsElement: HTMLDivElement | null = null

  public componentDidMount() {
    if (this.props.task.creating) {
      this.fadeIn()
    }
  }

  public render() {
    const { task, elementRef, contentRef } = this.props
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
            <div className="text-container">
              <div className="description">{task.description}</div>
              {task.editing && (
                <textarea
                  spellCheck={false}
                  value={task.description}
                  onChange={this.handleTextChange}
                  onKeyPress={this.handleKeyPress}
                  ref={this.handleTextarea}
                  onBlur={this.handleBlur}
                />
              )}
            </div>
            <div className="avatar-container">{task.userLabel && <div className={'avatar ' + task.userLabel} />}</div>
            <div className="label-container">
              <div className="labels">
                {task.labels.map(l => (
                  <div key={l.name} className={'label ' + l.color}>
                    {l.name}
                  </div>
                ))}
              </div>
              <div className="buttons" ref={this.handleButtons}>
                <button onClick={this.startEditing} className="edit-button">
                  <EditIcon />
                </button>
                <button>
                  <AssignmentIndIcon />
                </button>
                <button>
                  <LocalOfferIcon />
                </button>
                <button onClick={this.fadeOut}>
                  <CloseIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  private handleTextarea = (e: HTMLTextAreaElement | null) => {
    if (this.textareaElement) {
      this.textareaElement.removeEventListener('mousedown', this.stopPropagation)
    }
    this.textareaElement = e
    if (this.textareaElement) {
      this.textareaElement.addEventListener('mousedown', this.stopPropagation)
      if (!this.props.task.creating) {
        this.textareaElement.focus()
      }
    }
  }

  private handleButtons = (e: HTMLDivElement | null) => {
    if (this.buttonsElement) {
      this.buttonsElement.removeEventListener('mousedown', this.stopPropagation)
    }
    this.buttonsElement = e
    if (this.buttonsElement) {
      this.buttonsElement.addEventListener('mousedown', this.stopPropagation)
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

  private handleBlur = () => {
    const { task, onChange } = this.props
    if (task.creating) {
      if (!task.description && !task.userLabel && task.labels.length === 0) {
        this.fadeOut()
      } else if (task.editing) {
        onChange({ ...task, editing: false, creating: false })
      }
    } else if (task.editing) {
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
    this.setState({ height: this.rootElement.scrollHeight, removing: true })
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
