import React from 'react'
import { Category, DragState, initialState } from '../../state'
import AddIcon from '../../assets/icons/AddIcon'
import TaskDraggable from './TaskDraggable'
import './TaskBoard.scss'

interface TaskBoardState {
  categories: Category[]
  dragState?: DragState
}

class TaskBoard extends React.Component<{}, TaskBoardState> {
  public state: TaskBoardState = { categories: initialState.categories }

  public componentDidUpdate(_: any, prevState: TaskBoardState) {
    if (!prevState.dragState && this.state.dragState) {
      requestAnimationFrame(() => {
        this.setState({ dragState: { ...(this.state.dragState as DragState), sourceCollapseStarted: true } })
      })
    }
  }

  public render() {
    const { categories, dragState } = this.state
    const sourceCollapse = dragState && dragState.sourceCollapseStarted
    const draggedTaskHeight = dragState && dragState.sourceTaskHeight + 'px'
    return (
      <div className={'task-board' + (sourceCollapse ? ' source-collapse' : '')}>
        {categories.map(c => (
          <div key={c.id} className="category">
            <h2>{c.label}</h2>
            <button className="add-button">
              <AddIcon />
            </button>
            <div className="task-list">
              {c.tasks.map((t, i) => {
                const dragged = dragState && c.id === dragState.sourceCategoryId && t.id === dragState.sourceTaskId
                return (
                  <React.Fragment key={t.id}>
                    <div
                      key="placeholder"
                      className="placeholder"
                      style={dragged ? { height: draggedTaskHeight } : undefined}
                    />
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
              <div className="end-placeholder" style={{ height: sourceCollapse ? draggedTaskHeight : '0' }} />
            </div>
          </div>
        ))}
      </div>
    )
  }

  private handleDragStart = (categoryId: string, taskId: string, taskIndex: number, currentHeight: number) => {
    this.setState({
      dragState: {
        sourceCategoryId: categoryId,
        sourceTaskId: taskId,
        sourceTaskIndex: taskIndex,
        sourceTaskHeight: currentHeight,
        sourceCollapseStarted: false,
        hoverExpandStarted: false,
      },
    })
  }

  private handleDragEnd = () => {
    this.setState({ dragState: undefined })
  }
}

export default TaskBoard
