import React from 'react'
import { Category, initialState } from '../../state'
import AddIcon from '../../assets/icons/AddIcon'
import TaskDraggable from './TaskDraggable'
import './TaskBoard.scss'

interface TaskBoardState {
  categories: Category[]
  dragState?: {
    sourceCategoryId: string
    sourceTaskId: string
    sourceTaskIndex: number
    sourceCollapseStarted: boolean
    hoverCategoryId?: string
    hoverTaskIndex?: number
    hoverExpandStarted: boolean
    x: number
    y: number
    width: number
    height: number
    boardHeight: number
  }
}

class TaskBoard extends React.Component<{}, TaskBoardState> {
  public state: TaskBoardState = { categories: initialState.categories }

  private rootElement!: HTMLDivElement

  public componentDidUpdate(_: any, prevState: TaskBoardState) {
    if (!prevState.dragState && this.state.dragState) {
      setTimeout(() => {
        this.setState({ dragState: { ...(this.state.dragState as any), sourceCollapseStarted: true } })
      }, 100)
    }
  }

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
                const dragged = dragState && c.id === dragState.sourceCategoryId && t.id === dragState.sourceTaskId
                const sourceCollapse = dragState && dragState.sourceCollapseStarted
                const draggedTaskHeight = dragState && dragState.height + 'px'
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
                      x={dragState && dragged ? dragState.x : undefined}
                      y={dragState && dragged ? dragState.y : undefined}
                      width={dragState && dragged ? dragState.width : undefined}
                      height={dragState && dragged ? dragState.height : undefined}
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
    categoryId: string,
    taskId: string,
    taskIndex: number,
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    this.setState({
      dragState: {
        sourceCategoryId: categoryId,
        sourceTaskId: taskId,
        sourceTaskIndex: taskIndex,
        sourceCollapseStarted: false,
        hoverExpandStarted: false,
        x,
        y,
        width,
        height,
        boardHeight: this.rootElement.clientHeight,
      },
    })
  }

  private handleDrag = (x: number, y: number) => {
    this.setState({ dragState: { ...(this.state.dragState as any), x, y } })
  }

  private handleDragEnd = () => {
    this.setState({ dragState: undefined })
  }
}

export default TaskBoard
