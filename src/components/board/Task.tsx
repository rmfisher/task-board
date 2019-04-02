import React from 'react'
import { Task } from '../../state'
import MoreHorizIcon from '../../assets/icons/MoreHoriz'
import './Task.scss'

interface TaskProps {
  task: Task
  className?: string
  rootRef: React.Ref<HTMLDivElement>
}

const TaskComponent: React.FunctionComponent<TaskProps> = ({ task, rootRef }) => (
  <div className="task" ref={rootRef}>
    <div className="task-content">
      <div className="top-row">
        <div className="description">{task.description}</div>
        <button className="plain">
          <MoreHorizIcon />
        </button>
      </div>
      <div className={'avatar ' + task.userLabel} />
      <div className="labels">
        {task.labels.map(l => (
          <div key={l.name} className={'label ' + l.color}>
            {l.name}
          </div>
        ))}
      </div>
    </div>
  </div>
)

export default TaskComponent
