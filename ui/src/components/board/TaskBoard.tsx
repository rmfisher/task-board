import React from 'react'
import { Category } from '../../state'
import AddIcon from '../../assets/icons/Add'
import TaskDraggable from './TaskDraggable'
import TaskDragHelper from './TaskDragHelper'
import Placeholder from './Placeholder'
import './TaskBoard.scss'

interface TaskBoardProps {
  data: Category[]
  onChange: (data: Category[]) => void
}

interface TaskBoardState {
  dataSnapshot?: Category[]
  dragState?: {
    draggedTaskId: string
    draggedTaskIndex: number
    draggedTaskHeight: number
    draggedCategoryIndex: number
    hoveredCategoryIndex?: number
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
          const categoryHovered = dragState && dragState.hoveredCategoryIndex === i
          return (
            <div key={c.id} className="category">
              <h2>{c.label}</h2>
              <button className="add-button" disabled>
                <AddIcon />
              </button>
              <div className="task-list">
                {dragState && (
                  <Placeholder
                    key={'hover-placeholder-0'}
                    height={dragState.draggedTaskHeight}
                    expanded={!!categoryHovered && dragState.hoveredTaskIndex === 0}
                  />
                )}
                {c.tasks.map((t, j) => {
                  let dragged, hoveredAfter
                  if (dragState) {
                    dragged = dragState.draggedCategoryIndex === i && dragState.draggedTaskId === t.id
                    if (categoryHovered) {
                      if (
                        dragState.draggedCategoryIndex === i &&
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
                        categoryIndex={i}
                        dragged={dragged}
                        onMouseDown={this.handleMouseDown}
                        onMouseMove={this.handleMouseMove}
                        onMouseUp={this.handleMouseUp}
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
    categoryIndex: number
  ) => {
    this.dragHelper.onMouseDown(mouseX, mouseY, draggedElement, this.rootElement, taskId, taskIndex, categoryIndex)
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
    draggedCategoryIndex: number,
    hoveredCategoryIndex: number,
    hoveredTaskIndex: number
  ) => {
    this.setState({
      dragState: {
        draggedTaskId,
        draggedTaskIndex,
        draggedTaskHeight,
        draggedCategoryIndex,
        hoveredCategoryIndex,
        hoveredTaskIndex,
      },
      dataSnapshot: this.props.data,
    })
  }

  private handleDragHover = (hoveredCategoryIndex?: number, hoveredTaskIndex?: number) => {
    const { dragState } = this.state
    if (hoveredCategoryIndex !== dragState!.hoveredCategoryIndex || hoveredTaskIndex !== dragState!.hoveredTaskIndex) {
      this.setState({ dragState: { ...dragState!, hoveredCategoryIndex, hoveredTaskIndex } })
    }
  }

  private handleDragDrop = (categoryIndex?: number, taskIndex?: number) => {
    this.setState({ dropping: true })
    if (categoryIndex !== undefined && taskIndex !== undefined) {
      const { draggedCategoryIndex, draggedTaskIndex } = this.state.dragState!
      if (draggedCategoryIndex !== categoryIndex || draggedTaskIndex !== taskIndex) {
        this.notifyChange(draggedCategoryIndex, draggedTaskIndex, categoryIndex, taskIndex)
      }
    }
  }

  private handleDragEnd = () => {
    this.setState({ dataSnapshot: undefined, dragState: undefined, dropping: false })
  }

  // Change position from source (i, j) to destination (k, l)
  private notifyChange(i: number, j: number, k: number, l: number) {
    const newData = [...this.props.data]
    if (i === k) {
      const tasks = [...newData[i].tasks]
      tasks.splice(l, 0, tasks.splice(j, 1)[0])

      newData[i] = { ...newData[i], tasks }
    } else {
      const sourceTasks = [...newData[i].tasks]
      const destinationTasks = [...newData[k].tasks]
      destinationTasks.splice(l, 0, sourceTasks.splice(j, 1)[0])

      newData[i] = { ...newData[i], tasks: sourceTasks }
      newData[k] = { ...newData[k], tasks: destinationTasks }
    }
    this.props.onChange(newData)
  }
}

export default TaskBoard
