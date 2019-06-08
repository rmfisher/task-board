import React from 'react'
import MoreVertIcon from '../../assets/icons/MoreVertIcon'
import MenuButton from '../widgets/MenuButton'
import './TaskMenuButton.scss'

interface TaskMenuButtonProps {
  startEditing: () => void
  remove: () => void
  disabled: boolean
}

const TaskMenuButton: React.FunctionComponent<TaskMenuButtonProps> = ({ startEditing, remove, disabled }) => (
  <MenuButton
    className="task-menu-button"
    buttonContent={<MoreVertIcon />}
    items={[
      { text: 'Edit', onClick: startEditing },
      { text: 'Assign', onClick: () => {} },
      { text: 'Tags', onClick: () => {} },
      { text: 'Delete', onClick: remove },
    ]}
    disabled={disabled}
  />
)

export default TaskMenuButton
