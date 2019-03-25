import React from 'react'
import { Task } from '../../state'
import TaskComponent from './Task'

const DRAG_THRESHOLD = 10

interface TaskDraggableProps {
  task: Task
  taskIndex: number
  categoryIndex: number
  dragged?: boolean
  onDragStart: (
    draggedTask: string,
    draggedTaskIndex: number,
    draggedCategoryIndex: number,
    draggedElement: HTMLDivElement
  ) => void
  onDragEnd: () => void
}

class TaskDraggable extends React.Component<TaskDraggableProps> {
  public readonly state = { width: 0, height: 0, mouseDown: false }

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
    const { task, dragged } = this.props
    return (
      <TaskComponent
        task={task}
        className={dragged ? 'dragged' : undefined}
        rootRef={e => (this.rootElement = e as HTMLDivElement)}
      />
    )
  }

  private handleMouseDown = (e: MouseEvent) => {
    if (e.button === 0) {
      e.preventDefault()
      this.mouseDown = true
      this.mouseStartX = e.clientX
      this.mouseStartY = e.clientY
      this.startX = this.rootElement.offsetLeft
      this.startY = this.rootElement.offsetTop
    }
  }

  private handleMouseMove = (e: MouseEvent) => {
    const deltaX = e.clientX - this.mouseStartX
    const deltaY = e.clientY - this.mouseStartY

    if (this.mouseDown && !this.dragInProgress && Math.hypot(deltaX, deltaY) > DRAG_THRESHOLD) {
      this.dragInProgress = true
      this.rootElement.style.width = this.rootElement.clientWidth + 'px'
      this.rootElement.style.height = this.rootElement.clientHeight + 'px'

      this.props.onDragStart(this.props.task.id, this.props.taskIndex, this.props.categoryIndex, this.rootElement)
    }

    if (this.dragInProgress) {
      this.rootElement.style.left = this.startX + deltaX + 'px'
      this.rootElement.style.top = this.startY + deltaY + 'px'
    }
  }

  private endDrag = () => {
    this.dragInProgress = false
    this.mouseDown = false
    this.rootElement.style.width = null
    this.rootElement.style.height = null
    this.rootElement.style.left = null
    this.rootElement.style.top = null
    this.props.onDragEnd()
  }
}

export default TaskDraggable
