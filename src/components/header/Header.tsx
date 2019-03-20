import React from 'react'
import { User } from '../../state/state'
import './Header.scss'

interface HeaderProps {
  users: User[]
}

const Header: React.FunctionComponent<HeaderProps> = ({ users }) => (
  <div className="header">
    <h1>Bug Tracking</h1>
    <div className="avatars">
      {users.map(u => (
        <div key={u.id} className={'avatar ' + u.label} />
      ))}
    </div>
  </div>
)

export default Header
