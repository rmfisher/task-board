import React from 'react'
import { Task } from '../../state'
import TaskComponent from './Task'

const DRAG_THRESHOLD = 20

interface TaskDraggableProps {
  categoryId: string
  task: Task
  taskIndex: number
  dragged?: boolean
  onDragStart: (categoryId: string, taskId: string, taskIndex: number, currentHeight: number) => void
  onDragEnd: () => void
}

class TaskDraggable extends React.Component<TaskDraggableProps> {
  private rootElement!: HTMLDivElement
  private startX: number = 0
  private startY: number = 0
  private mouseDown: boolean = false
  private dragInProgress: boolean = false

  public componentDidMount() {
    this.rootElement.addEventListener('mousedown', this.handleMouseDown)
    document.addEventListener('mousemove', this.handleMouseMove)
    window.addEventListener('mouseup', this.endDrag)
    window.addEventListener('blur', this.endDrag)
  }

  public componentWillUnmount() {
    this.rootElement.removeEventListener('mousedown', this.handleMouseDown)
    document.removeEventListener('mousemove', this.handleMouseMove)
    window.removeEventListener('mouseup', this.endDrag)
    window.removeEventListener('blur', this.endDrag)
  }

  public render() {
    const { task, dragged } = this.props
    return <TaskComponent task={task} dragged={dragged} rootRef={e => (this.rootElement = e as HTMLDivElement)} />
  }

  private handleMouseDown = (e: MouseEvent) => {
    e.preventDefault()
    this.mouseDown = true
    this.startX = e.clientX
    this.startY = e.clientY
  }

  private handleMouseMove = (e: MouseEvent) => {
    const deltaX = e.clientX - this.startX
    const deltaY = e.clientY - this.startY

    if (this.mouseDown && !this.dragInProgress && Math.hypot(deltaX, deltaY) > DRAG_THRESHOLD) {
      this.dragInProgress = true
      this.props.onDragStart(
        this.props.categoryId,
        this.props.task.id,
        this.props.taskIndex,
        this.rootElement.clientHeight
      )
    }

    if (this.dragInProgress) {
      console.log(deltaX, deltaY)
    }
  }

  private endDrag = () => {
    this.dragInProgress = false
    this.mouseDown = false
    this.props.onDragEnd()
  }
}

export default TaskDraggable
