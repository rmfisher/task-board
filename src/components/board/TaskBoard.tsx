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

  public render() {
    const { categories, dragState } = this.state
    return (
      <div className="task-board">
        {categories.map(c => (
          <div key={c.id} className="category">
            <h2>{c.label}</h2>
            <button className="add-button">
              <AddIcon />
            </button>
            <div className="task-list">
              {c.tasks.map((t, i) => {
                const dragged = this.isTaskDragged(c.id, t.id)
                const collapsed = dragState && dragState.sourceCollapseStarted
                return dragged ? (
                  <React.Fragment>
                    <div className={'placeholder' + (collapsed ? ' collapsed' : '')} />
                    <TaskDraggable
                      key={t.id}
                      categoryId={c.id}
                      task={t}
                      taskIndex={i}
                      dragged
                      onDragStart={this.handleDragStart}
                    />
                  </React.Fragment>
                ) : (
                  <TaskDraggable
                    key={t.id}
                    categoryId={c.id}
                    task={t}
                    taskIndex={i}
                    onDragStart={this.handleDragStart}
                  />
                )
              })}
            </div>
          </div>
        ))}
      </div>
    )
  }

  private handleDragStart = (categoryId: string, taskId: string, taskIndex: number) => {}

  private isTaskDragged = (categoryId: string, taskId: string) => {
    const { dragState } = this.state
    return dragState && categoryId === dragState.sourceCategoryId && taskId === dragState.sourceTaskId
  }
}

export default TaskBoard
