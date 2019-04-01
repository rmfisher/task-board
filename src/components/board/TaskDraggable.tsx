import React from 'react'
import { Task } from '../../state'
import TaskComponent from './Task'

interface TaskDraggableProps {
  task: Task
  taskIndex: number
  categoryIndex: number
  dragged?: boolean
  onMouseDown: (
    mouseX: number,
    mouseY: number,
    draggedElement: HTMLDivElement,
    taskId: string,
    taskIndex: number,
    categoryIndex: number
  ) => void
  onMouseMove: (mouseX: number, mouseY: number) => void
  onMouseUp: () => void
}

class TaskDraggable extends React.Component<TaskDraggableProps> {
  private rootElement!: HTMLDivElement

  public componentDidMount() {
    this.rootElement.addEventListener('mousedown', this.handleMouseDown)
    this.rootElement.addEventListener('touchstart', this.handleTouchStart)
    document.addEventListener('mousemove', this.handleMouseMove)
    window.addEventListener('mouseup', this.handleMouseUp)
    window.addEventListener('blur', this.handleMouseUp)
  }

  public componentWillUnmount() {
    this.rootElement.removeEventListener('mousedown', this.handleMouseDown)
    this.rootElement.removeEventListener('touchstart', this.handleTouchStart)
    document.removeEventListener('mousemove', this.handleMouseMove)
    window.removeEventListener('mouseup', this.handleMouseUp)
    window.removeEventListener('blur', this.handleMouseUp)
  }

  public render() {
    return <TaskComponent task={this.props.task} rootRef={e => (this.rootElement = e as HTMLDivElement)} />
  }

  private handleMouseDown = (e: MouseEvent) => {
    if (e.button === 0) {
      e.preventDefault()
      this.props.onMouseDown(
        e.clientX,
        e.clientY,
        this.rootElement,
        this.props.task.id,
        this.props.taskIndex,
        this.props.categoryIndex
      )
    } else {
      this.handleMouseUp()
    }
  }

  private handleMouseMove = (e: MouseEvent) => {
    this.props.onMouseMove(e.clientX, e.clientY)
  }

  private handleMouseUp = () => {
    this.props.onMouseUp()
  }

  private handleTouchStart = (e: TouchEvent) => {}
}

export default TaskDraggable
