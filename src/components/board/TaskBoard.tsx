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
    hoveredTaskIndex?: number
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
    if (dragState) {
      console.log(dragState.hoveredCategoryIndex, dragState.hoveredTaskIndex)
    }
    return (
      <div className="task-board" style={style} ref={e => (this.rootElement = e as HTMLDivElement)}>
        {categories.map((c, i) => {
          const categoryHovered = dragState && dragState.hoveredCategoryIndex === i
          const firstTaskHovered = categoryHovered && dragState!.hoveredTaskIndex === 0
          const heightStyle = dragState && { height: dragState.draggedTaskHeight + 'px' }
          return (
            <div key={c.id} className="category">
              <h2>{c.label}</h2>
              <button className="add-button">
                <AddIcon />
              </button>
              <div className="task-list">
                {firstTaskHovered && (
                  <div key={'hover-placeholder-0'} className="hover-placeholder" style={heightStyle} />
                )}
                {c.tasks.map((t, j) => {
                  let dragged, sourceCollapse, hoveredAfter
                  if (dragState) {
                    dragged = dragState.draggedCategoryIndex === i && dragState.draggedTask === t.id
                    sourceCollapse = dragState.collapseStarted
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
                      {false && dragged && (
                        <div
                          key="placeholder"
                          className={'placeholder' + (sourceCollapse ? ' collapsed' : '')}
                          style={heightStyle}
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
                      {hoveredAfter && (
                        <div key={'hover-placeholder-' + (j + 1)} className="hover-placeholder" style={heightStyle} />
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
      if (!this.state.dragState) return
      this.setState({ dragState: { ...this.state.dragState, collapseStarted: true } })
    }, COLLAPSE_DELAY)

    this.dragDropHelper.storeTaskLayout(this.rootElement, draggedElement)
  }

  private handleDrag = (x: number, y: number, draggedElement: HTMLDivElement) => {
    if (!this.state.dragState) return

    const { clampedX, clampedY } = this.dragDropHelper.clampPosition(x, y)
    draggedElement.style.left = clampedX + 'px'
    draggedElement.style.top = clampedY + 'px'

    const location = this.dragDropHelper.getHoverLocation(x, y)
    const dragState = this.state.dragState
    const hoveredCategoryIndex = location ? location.i : undefined
    const hoveredTaskIndex = location ? location.j : undefined

    if (hoveredCategoryIndex !== dragState.hoveredCategoryIndex || hoveredTaskIndex !== dragState.hoveredTaskIndex) {
      this.setState({ dragState: { ...dragState, hoveredCategoryIndex, hoveredTaskIndex } })
    }
  }

  private handleDragEnd = () => {
    this.setState({ dragState: undefined })
  }
}

export default TaskBoard
