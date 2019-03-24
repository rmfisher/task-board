import React from 'react'
import { Category, initialState } from '../../state'
import AddIcon from '../../assets/icons/AddIcon'
import TaskDraggable from './TaskDraggable'
import './TaskBoard.scss'

const COLLAPSE_DELAY = 100

interface TaskBoardState {
  categories: Category[]
  dragState?: {
    draggedTask: string
    draggedTaskIndex: number
    draggedTaskCategory: string
    draggedTaskHeight: number
    hoveredCategory?: string
    hoveredIndex?: number
    collapseStarted: boolean
    expandStarted: boolean
    boardHeight: number
  }
}

class TaskBoard extends React.Component<{}, TaskBoardState> {
  public state: TaskBoardState = { categories: initialState.categories }

  private rootElement!: HTMLDivElement

  public render() {
    const { categories, dragState } = this.state
    const style = dragState ? { minHeight: dragState.boardHeight + 'px' } : undefined
    return (
      <div className="task-board" style={style} ref={e => (this.rootElement = e as HTMLDivElement)}>
        {categories.map(c => (
          <div key={c.id} className="category">
            <h2>{c.label}</h2>
            <button className="add-button">
              <AddIcon />
            </button>
            <div className="task-list">
              {c.tasks.map((t, i) => {
                const dragged = dragState && c.id === dragState.draggedTaskCategory && t.id === dragState.draggedTask
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
                      categoryId={c.id}
                      task={t}
                      taskIndex={i}
                      dragged={dragged}
                      onDragStart={this.handleDragStart}
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
    draggedTaskCategory: string,
    draggedTaskHeight: number
  ) => {
    this.setState({
      dragState: {
        draggedTask,
        draggedTaskIndex,
        draggedTaskCategory,
        draggedTaskHeight,
        collapseStarted: false,
        expandStarted: false,
        boardHeight: this.rootElement.clientHeight,
      },
    })

    setTimeout(() => {
      this.setState({ dragState: { ...(this.state.dragState as any), collapseStarted: true } })
    }, COLLAPSE_DELAY)
  }

  private handleDragEnd = () => {
    this.setState({ dragState: undefined })
  }
}

export default TaskBoard
