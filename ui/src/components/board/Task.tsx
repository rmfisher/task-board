import React from 'react'
import { Task } from '../../state'
import EditIcon from '../../assets/icons/EditIcon'
import AssignmentIndIcon from '../../assets/icons/AssignmentIndIcon'
import LocalOfferIcon from '../../assets/icons/LocalOfferIcon'
import './Task.scss'

const FADE_IN_DURATION = 260
const FADE_OUT_DURATION = FADE_IN_DURATION + 120

interface TaskProps {
  task: Task
  elementRef: any
  onChange: (task: Task) => void
  remove: () => void
}

interface TaskState {
  mounted: boolean
  height: number | null
}

class TaskComponent extends React.PureComponent<TaskProps, TaskState> {
  public readonly state = { mounted: false, height: 0 }
  private rootElement!: HTMLDivElement
  private textareaElement: HTMLTextAreaElement | null = null

  public componentDidMount() {
    if (this.props.task.creating) {
      this.fadeIn()
    }
  }

  public render() {
    const { task, elementRef } = this.props
    const { mounted, height } = this.state
    const style = task.creating && height !== null ? { height } : undefined
    return (
      <div
        className={
          'task-container' +
          (task.creating ? ' creating' : '') +
          (mounted ? ' mounted' : '') +
          (task.editing ? ' editing' : '')
        }
        style={style}
        ref={e => {
          this.rootElement = e as HTMLDivElement
          elementRef(e)
        }}
      >
        <div className="task">
          <div className="task-content">
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
              <div className="buttons">
                <button onClick={this.startEditing}>
                  <EditIcon />
                </button>
                <button>
                  <AssignmentIndIcon />
                </button>
                <button>
                  <LocalOfferIcon />
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

  private fadeIn() {
    setTimeout(() => this.setState({ mounted: true, height: this.rootElement.scrollHeight }), 1)
    setTimeout(() => {
      if (this.textareaElement) {
        this.textareaElement.focus()
      }
      this.setState({ height: null })
    }, FADE_IN_DURATION)
  }

  private fadeOut() {
    this.setState({ height: this.rootElement.scrollHeight })
    setTimeout(() => {
      this.setState({ mounted: false, height: 0 })
      setTimeout(() => {
        this.props.remove()
      }, FADE_OUT_DURATION)
    }, 1)
  }

  private startEditing = () => {
    const { task, onChange } = this.props
    if (!task.editing) {
      onChange({ ...task, editing: true })
    }
  }

  private stopPropagation = (e: MouseEvent) => e.stopPropagation()
}

export default TaskComponent
