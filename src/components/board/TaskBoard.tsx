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
  public state = { categories: initialState.categories }

  public render() {
    const { categories } = this.state
    return (
      <div className="task-board">
        {categories.map(c => (
          <div key={c.id} className="category">
            <h2>{c.label}</h2>
            <button className="add-button">
              <AddIcon />
            </button>
            <div className="task-list">
              {c.tasks.map((t, i) => (
                <TaskDraggable key={t.id} categoryId={c.id} task={t} taskIndex={i} setDragState={() => {}} />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }
}

export default TaskBoard
