import React from 'react'
import MoreVertIcon from '../../assets/icons/MoreVertIcon'
import EditIcon from '../../assets/icons/EditIcon'
import AssignmentIndIcon from '../../assets/icons/AssignmentIndIcon'
import LocalOfferIcon from '../../assets/icons/LocalOfferIcon'
import CloseIcon from '../../assets/icons/CloseIcon'
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
    buttonIcon={<MoreVertIcon />}
    items={[
      { icon: <EditIcon />, text: 'Edit', onClick: startEditing },
      { icon: <AssignmentIndIcon />, text: 'Assign', onClick: () => {} },
      { icon: <LocalOfferIcon />, text: 'Labels', onClick: () => {} },
      { icon: <CloseIcon />, text: 'Delete', onClick: remove },
    ]}
    disabled={disabled}
  />
)

export default TaskMenuButton
