import React from 'react'
import { Task } from '../../state/types'
import TaskComponent from './Task'

const DRAG_THRESHOLD = 20

interface DraggableTaskProps {
  task: Task
}

class DraggableTask extends React.Component<DraggableTaskProps> {
  private rootElement: any
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
    const { task } = this.props
    return <TaskComponent rootRef={e => (this.rootElement = e)} task={task} />
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
    }
    if (this.dragInProgress) {
      console.log(deltaX, deltaY)
    }
  }

  private endDrag = () => {
    this.dragInProgress = false
    this.mouseDown = false
  }
}

export default DraggableTask
