import React from 'react'
import { Category, initialState } from '../../state'
import AddIcon from '../../assets/icons/AddIcon'
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
              <button className="add-button">
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
              <div className="extra-height" aria-hidden="true" />
            </div>
          )
        })}
      </div>
    )
  }

  private handleMouseDown = (
    e: MouseEvent,
    draggedElement: HTMLDivElement,
    taskId: string,
    taskIndex: number,
    categoryIndex: number
  ) => {
    this.dragHelper.onMouseDown(e, draggedElement, this.rootElement, taskId, taskIndex, categoryIndex)
  }

  private handleMouseMove = (e: MouseEvent) => {
    this.dragHelper.onMouseMove(e)
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

  private handleDragDrop = () => {
    this.setState({ dropping: true })
    this.props.onChange(this.props.data)
  }

  private handleDragEnd = () => {
    this.setState({ dataSnapshot: undefined, dragState: undefined, dropping: false })
  }
}

export default TaskBoard
