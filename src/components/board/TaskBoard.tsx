import React from 'react'
import { Category } from '../../state/state'
import AddIcon from '../../assets/icons/AddIcon'
import './TaskBoard.scss'

interface TaskBoardProps {
  categories: Category[]
}

const TaskBoard: React.FunctionComponent<TaskBoardProps> = ({ categories }) => (
  <div className="task-board">
    {categories.map(c => (
      <div key={c.id} className="category">
        <h2>{c.label}</h2>
        <button className="add-button">
          <AddIcon />
        </button>
      </div>
    ))}
  </div>
)

export default TaskBoard
