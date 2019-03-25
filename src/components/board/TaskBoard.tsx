import React from 'react'
import { Category, initialState } from '../../state'
import AddIcon from '../../assets/icons/AddIcon'
import TaskDraggable from './TaskDraggable'
import DragDropHelper from '../../utils/DragDropHelper'
import './TaskBoard.scss'

const COLLAPSE_DELAY = 100

interface TaskBoardState {
  categories: Category[]
  dragState?: {
    draggedTask: string
    draggedTaskIndex: number
    draggedTaskHeight: number
    draggedCategoryIndex: number
    hoveredCategoryIndex?: number
    hoveredIndex?: number
    collapseStarted: boolean
    expandStarted: boolean
    boardHeight: number
  }
}

class TaskBoard extends React.Component<{}, TaskBoardState> {
  public state: TaskBoardState = { categories: initialState.categories }

  private rootElement!: HTMLDivElement
  private dragDropHelper = new DragDropHelper()

  public render() {
    const { categories, dragState } = this.state
    const style = dragState ? { minHeight: dragState.boardHeight + 'px' } : undefined
    return (
      <div className="task-board" style={style} ref={e => (this.rootElement = e as HTMLDivElement)}>
        {categories.map((c, i) => (
          <div key={c.id} className="category">
            <h2>{c.label}</h2>
            <button className="add-button">
              <AddIcon />
            </button>
            <div className="task-list">
              {c.tasks.map((t, j) => {
                const dragged = dragState && i === dragState.draggedCategoryIndex && t.id === dragState.draggedTask
                const sourceCollapse = dragState && dragState.collapseStarted
                const draggedTaskHeight = dragState && dragState.draggedTaskHeight + 'px'
                return (
                  <React.Fragment key={t.id}>
                    {dragged && (
                      <div
                        key="placeholder"
                        className={'placeholder' + (sourceCollapse ? ' collapsed' : '')}
                        style={{ height: draggedTaskHeight }}
                      />
                    )}
                    <TaskDraggable
                      key={t.id}
                      task={t}
                      taskIndex={j}
                      categoryIndex={i}
                      dragged={dragged}
                      onDragStart={this.handleDragStart}
                      onDrag={this.handleDrag}
                      onDragEnd={this.handleDragEnd}
                    />
                  </React.Fragment>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    )
  }

  private handleDragStart = (
    draggedTask: string,
    draggedTaskIndex: number,
    draggedCategoryIndex: number,
    draggedElement: HTMLDivElement
  ) => {
    this.setState({
      dragState: {
        draggedTask,
        draggedTaskIndex,
        draggedTaskHeight: draggedElement.clientHeight,
        draggedCategoryIndex,
        collapseStarted: false,
        expandStarted: false,
        boardHeight: this.rootElement.clientHeight,
      },
    })

    setTimeout(() => {
      this.setState({ dragState: { ...(this.state.dragState as any), collapseStarted: true } })
    }, COLLAPSE_DELAY)

    this.dragDropHelper.storeTaskLayout(this.rootElement, draggedElement)
  }

  private handleDrag = (x: number, y: number, draggedElement: HTMLDivElement) => {
    const { clampedX, clampedY } = this.dragDropHelper.clampTaskPosition(x, y)
    draggedElement.style.left = clampedX + 'px'
    draggedElement.style.top = clampedY + 'px'
  }

  private handleDragEnd = () => {
    this.setState({ dragState: undefined })
  }
}

export default TaskBoard
