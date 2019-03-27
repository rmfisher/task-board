import React from 'react'
import { Task } from '../../state'
import TaskComponent from './Task'

interface TaskDraggableProps {
  task: Task
  taskIndex: number
  categoryIndex: number
  dragged?: boolean
  onMouseDown: (
    e: MouseEvent,
    draggedElement: HTMLDivElement,
    taskId: string,
    taskIndex: number,
    categoryIndex: number
  ) => void
  onMouseMove: (e: MouseEvent) => void
  onMouseUp: () => void
}

class TaskDraggable extends React.Component<TaskDraggableProps> {
  private rootElement!: HTMLDivElement

  public componentDidMount() {
    this.rootElement.addEventListener('mousedown', this.handleMouseDown)
    document.addEventListener('mousemove', this.handleMouseMove)
    window.addEventListener('mouseup', this.handleMouseUp)
    window.addEventListener('blur', this.handleMouseUp)
  }

  public componentWillUnmount() {
    this.rootElement.removeEventListener('mousedown', this.handleMouseDown)
    document.removeEventListener('mousemove', this.handleMouseMove)
    window.removeEventListener('mouseup', this.handleMouseUp)
    window.removeEventListener('blur', this.handleMouseUp)
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
    this.props.onMouseDown(e, this.rootElement, this.props.task.id, this.props.taskIndex, this.props.categoryIndex)
  }

  private handleMouseMove = (e: MouseEvent) => {
    this.props.onMouseMove(e)
  }

  private handleMouseUp = () => {
    this.props.onMouseUp()
  }
}

export default TaskDraggable
