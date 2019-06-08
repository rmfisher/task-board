import React from 'react'
import { Task } from '../../state'
import TaskComponent from './Task'

interface TaskDraggableProps {
  task: Task
  taskIndex: number
  columnIndex: number
  dragged?: boolean
  onMouseDown: (
    mouseX: number,
    mouseY: number,
    draggedElement: HTMLDivElement,
    taskId: string,
    taskIndex: number,
    columnIndex: number
  ) => void
  onMouseMove: (mouseX: number, mouseY: number) => void
  onMouseUp: () => void
  onChange: (columnIndex: number, taskIndex: number, task: Task) => void
  remove: (columnIndex: number, taskIndex: number) => void
}

class TaskDraggable extends React.PureComponent<TaskDraggableProps> {
  private rootElement!: HTMLDivElement
  private contentElement!: HTMLDivElement

  public componentDidMount() {
    this.contentElement.addEventListener('mousedown', this.handleMouseDown)
    this.contentElement.addEventListener('touchstart', this.handleTouchStart)
    this.contentElement.addEventListener('mouseup', this.handleTaskMouseUp)
    document.addEventListener('mousemove', this.handleMouseMove)
    document.addEventListener('touchmove', this.handleTouchMove)
    window.addEventListener('mouseup', this.handleMouseUp)
    window.addEventListener('blur', this.handleMouseUp)
    window.addEventListener('touchend', this.handleMouseUp)
  }

  public componentWillUnmount() {
    this.contentElement.removeEventListener('mousedown', this.handleMouseDown)
    this.contentElement.removeEventListener('touchstart', this.handleTouchStart)
    this.contentElement.removeEventListener('mouseup', this.handleTaskMouseUp)
    document.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('touchmove', this.handleTouchMove)
    window.removeEventListener('mouseup', this.handleMouseUp)
    window.removeEventListener('blur', this.handleMouseUp)
    window.removeEventListener('touchend', this.handleMouseUp)
  }

  public render() {
    return (
      <TaskComponent
        task={this.props.task}
        elementRef={this.handleRef}
        contentRef={this.handleContentRef}
        dragged={!!this.props.dragged}
        onChange={this.handleChange}
        remove={this.handleRemove}
      />
    )
  }

  private handleMouseDown = (e: MouseEvent) => {
    if (e.button === 0) {
      if (e.cancelable) {
        e.preventDefault()
      }
      if (!this.props.task.editing) {
        this.props.onMouseDown(
          e.clientX,
          e.clientY,
          this.rootElement,
          this.props.task.id,
          this.props.taskIndex,
          this.props.columnIndex
        )
      }
    } else {
      this.handleMouseUp()
    }
  }

  private handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 1) {
      if (e.cancelable) {
        e.preventDefault()
      }
      this.props.onMouseDown(
        e.touches[0].clientX,
        e.touches[0].clientY,
        this.rootElement,
        this.props.task.id,
        this.props.taskIndex,
        this.props.columnIndex
      )
    }
  }

  private handleMouseMove = (e: MouseEvent) => {
    this.props.onMouseMove(e.clientX, e.clientY)
  }

  private handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 1) {
      this.props.onMouseMove(e.touches[0].clientX, e.touches[0].clientY)
    }
  }

  private handleMouseUp = () => this.props.onMouseUp()

  private handleRef = (e: HTMLDivElement | null) => (this.rootElement = e as HTMLDivElement)

  private handleContentRef = (e: HTMLDivElement | null) => (this.contentElement = e as HTMLDivElement)

  private handleChange = (task: Task) => {
    this.props.onChange(this.props.columnIndex, this.props.taskIndex, task)
  }

  private handleRemove = () => {
    this.props.remove(this.props.columnIndex, this.props.taskIndex)
  }

  private handleTaskMouseUp = () => {
    if (!this.props.task.editing) {
      const activeElement = document.activeElement as any
      if (activeElement) {
        activeElement.blur()
      }
    }
  }
}

export default TaskDraggable
