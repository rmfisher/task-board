import React from 'react'
import { v1 as uuid } from 'uuid'
import { Column, Task } from '../../state'
import AddIcon from '../../assets/icons/AddIcon'
import TaskDraggable from './TaskDraggable'
import TaskDragHelper from './TaskDragHelper'
import Placeholder from './Placeholder'
import './TaskBoard.scss'

interface TaskBoardProps {
  data: Column[]
  onChange: (data: Column[]) => void
}

interface TaskBoardState {
  dataSnapshot?: Column[]
  dragState?: {
    draggedTaskId: string
    draggedTaskIndex: number
    draggedTaskHeight: number
    draggedColumnIndex: number
    hoveredColumnIndex?: number
    hoveredTaskIndex?: number
  }
  dropping: boolean
}

class TaskBoard extends React.Component<TaskBoardProps, TaskBoardState> {
  public readonly state: TaskBoardState = { dropping: false }

  private rootElement!: HTMLDivElement
  private dragHelper = new TaskDragHelper()

  public componentDidMount() {
    this.dragHelper.setOnStart(this.handleDragStart)
    this.dragHelper.setOnHover(this.handleDragHover)
    this.dragHelper.setOnDrop(this.handleDragDrop)
    this.dragHelper.setOnEnd(this.handleDragEnd)
  }

  public render() {
    const { data } = this.props
    const { dataSnapshot, dragState, dropping } = this.state
    return (
      <div className={'task-board' + (dropping ? ' dropping' : '')} ref={e => (this.rootElement = e as HTMLDivElement)}>
        {(dataSnapshot || data).map((c, i) => {
          const columnHovered = dragState && dragState.hoveredColumnIndex === i
          const columnCreating = c.tasks.some(t => !!t.creating)
          return (
            <div key={c.id} className="column">
              <h2>{c.label}</h2>
              <button className="add-button raised" onClick={() => this.addTask(i)} disabled={columnCreating}>
                <AddIcon />
              </button>
              <div className="task-list">
                {dragState && (
                  <Placeholder
                    key={'hover-placeholder-0'}
                    height={dragState.draggedTaskHeight}
                    expanded={!!columnHovered && dragState.hoveredTaskIndex === 0}
                  />
                )}
                {c.tasks.map((t, j) => {
                  let dragged, hoveredAfter
                  if (dragState) {
                    dragged = dragState.draggedColumnIndex === i && dragState.draggedTaskId === t.id
                    if (columnHovered) {
                      if (
                        dragState.draggedColumnIndex === i &&
                        dragState.draggedTaskIndex < dragState.hoveredTaskIndex!
                      ) {
                        hoveredAfter = dragState.hoveredTaskIndex === j
                      } else {
                        hoveredAfter = dragState.hoveredTaskIndex === j + 1
                      }
                    }
                  }
                  return (
                    <React.Fragment key={t.id}>
                      <TaskDraggable
                        key={t.id}
                        task={t}
                        taskIndex={j}
                        columnIndex={i}
                        dragged={dragged}
                        onMouseDown={this.handleMouseDown}
                        onMouseMove={this.handleMouseMove}
                        onMouseUp={this.handleMouseUp}
                        onChange={this.updateTask}
                        remove={this.removeTask}
                      />
                      {dragState && t.id !== dragState.draggedTaskId && (
                        <Placeholder
                          key={'hover-placeholder-' + (j + 1)}
                          height={dragState.draggedTaskHeight}
                          expanded={!!hoveredAfter}
                        />
                      )}
                    </React.Fragment>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  private handleMouseDown = (
    mouseX: number,
    mouseY: number,
    draggedElement: HTMLDivElement,
    taskId: string,
    taskIndex: number,
    columnIndex: number
  ) => {
    this.dragHelper.onMouseDown(mouseX, mouseY, draggedElement, this.rootElement, taskId, taskIndex, columnIndex)
  }

  private handleMouseMove = (mouseX: number, mouseY: number) => {
    this.dragHelper.onMouseMove(mouseX, mouseY)
  }

  private handleMouseUp = () => {
    this.dragHelper.endDrag()
  }

  private handleDragStart = (
    draggedTaskId: string,
    draggedTaskIndex: number,
    draggedTaskHeight: number,
    draggedColumnIndex: number,
    hoveredColumnIndex: number,
    hoveredTaskIndex: number
  ) => {
    this.stopEdits(draggedColumnIndex, draggedTaskIndex)
    this.setState({
      dragState: {
        draggedTaskId,
        draggedTaskIndex,
        draggedTaskHeight,
        draggedColumnIndex,
        hoveredColumnIndex,
        hoveredTaskIndex,
      },
      dataSnapshot: this.props.data,
    })
  }

  private handleDragHover = (hoveredColumnIndex?: number, hoveredTaskIndex?: number) => {
    const { dragState } = this.state
    if (hoveredColumnIndex !== dragState!.hoveredColumnIndex || hoveredTaskIndex !== dragState!.hoveredTaskIndex) {
      this.setState({ dragState: { ...dragState!, hoveredColumnIndex, hoveredTaskIndex } })
    }
  }

  private handleDragDrop = (columnIndex?: number, taskIndex?: number) => {
    this.setState({ dropping: true })
    if (columnIndex !== undefined && taskIndex !== undefined) {
      const { draggedColumnIndex, draggedTaskIndex } = this.state.dragState!
      if (draggedColumnIndex !== columnIndex || draggedTaskIndex !== taskIndex) {
        this.notifyChange(draggedColumnIndex, draggedTaskIndex, columnIndex, taskIndex, true)
      }
    }
  }

  private handleDragEnd = () => {
    this.setState({ dataSnapshot: undefined, dragState: undefined, dropping: false })
  }

  // Change position from source (i, j) to destination (k, l)
  private notifyChange(i: number, j: number, k: number, l: number, justDropped?: boolean) {
    const newData = [...this.props.data]
    if (i === k) {
      const tasks = [...newData[i].tasks]
      const droppedTask = tasks.splice(j, 1)[0]
      const newTask = justDropped ? { ...droppedTask, justDropped } : droppedTask

      tasks.splice(l, 0, newTask)

      newData[i] = { ...newData[i], tasks }
    } else {
      const sourceTasks = [...newData[i].tasks]
      const destinationTasks = [...newData[k].tasks]
      const droppedTask = sourceTasks.splice(j, 1)[0]
      const newTask = justDropped ? { ...droppedTask, justDropped } : droppedTask

      destinationTasks.splice(l, 0, newTask)

      newData[i] = { ...newData[i], tasks: sourceTasks }
      newData[k] = { ...newData[k], tasks: destinationTasks }
    }
    this.props.onChange(newData)
  }

  private addTask = (i: number) => {
    const newTask = { id: uuid(), description: '', labels: [], creating: true, editing: true }
    const newData = [...this.props.data]
    const newColumn = { ...newData[i], tasks: [newTask, ...newData[i].tasks] }
    newData[i] = newColumn

    this.props.onChange(newData)
  }

  private removeTask = (i: number, j: number) => {
    const newData = [...this.props.data]
    newData[i].tasks = [...newData[i].tasks]
    newData[i].tasks.splice(j, 1)
    this.props.onChange(newData)
  }

  private stopEdits = (i: number, j: number) => {
    const task = this.props.data[i].tasks[j]
    if (task.creating || task.editing) {
      this.updateTask(i, j, { ...task, creating: false, editing: false })
    }
  }

  private updateTask = (i: number, j: number, newTask: Task) => {
    const newData = [...this.props.data]
    newData[i].tasks = [...newData[i].tasks]
    newData[i].tasks[j] = newTask
    this.props.onChange(newData)
  }
}

export default TaskBoard
