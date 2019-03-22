import React from 'react'
import { Task } from '../../state'
import TaskComponent from './Task'

const DRAG_THRESHOLD = 20

interface TaskDraggableProps {
  categoryId: string
  task: Task
  taskIndex: number
  dragged?: boolean
  x?: number
  y?: number
  width?: number
  height?: number
  onDragStart: (
    categoryId: string,
    taskId: string,
    taskIndex: number,
    x: number,
    y: number,
    width: number,
    height: number
  ) => void
  onDrag: (x: number, y: number) => void
  onDragEnd: () => void
}

class TaskDraggable extends React.Component<TaskDraggableProps> {
  private rootElement!: HTMLDivElement
  private startX: number = 0
  private startY: number = 0
  private mouseStartX: number = 0
  private mouseStartY: number = 0
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
    const { task, dragged, x, y, width, height } = this.props
    return (
      <TaskComponent
        task={task}
        dragged={dragged}
        x={x}
        y={y}
        width={width}
        height={height}
        rootRef={e => (this.rootElement = e as HTMLDivElement)}
      />
    )
  }

  private handleMouseDown = (e: MouseEvent) => {
    e.preventDefault()
    this.mouseDown = true
    this.mouseStartX = e.clientX
    this.mouseStartY = e.clientY
    this.startX = this.rootElement.offsetLeft
    this.startY = this.rootElement.offsetTop
  }

  private handleMouseMove = (e: MouseEvent) => {
    const deltaX = e.clientX - this.mouseStartX
    const deltaY = e.clientY - this.mouseStartY

    if (this.mouseDown && !this.dragInProgress && Math.hypot(deltaX, deltaY) > DRAG_THRESHOLD) {
      this.dragInProgress = true
      this.props.onDragStart(
        this.props.categoryId,
        this.props.task.id,
        this.props.taskIndex,
        this.startX + deltaX,
        this.startY + deltaY,
        this.rootElement.clientWidth,
        this.rootElement.clientHeight
      )
    }

    if (this.dragInProgress) {
      this.props.onDrag(this.startX + deltaX, this.startY + deltaY)
    }
  }

  private endDrag = () => {
    this.dragInProgress = false
    this.mouseDown = false
    this.props.onDragEnd()
  }
}

export default TaskDraggable
