import React from 'react'
import { Category } from '../../state/state'
import './TaskBoard.scss'

interface TaskBoardProps {
  categories: Category[]
}

const Header: React.FunctionComponent<TaskBoardProps> = ({ categories }) => <div className="task-board" />

export default Header
