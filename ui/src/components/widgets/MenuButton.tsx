import React from 'react'
import './MenuButton.scss'

interface MenuButtonProps {
  buttonIcon: React.ReactNode
  items: Array<{ icon: React.ReactNode; text: string; onClick: () => void }>
}

interface MenuButtonState {
  open: boolean
}

class MenuButton extends React.Component<MenuButtonProps, MenuButtonState> {
  public readonly state = { open: false }

  public render() {
    const { buttonIcon, items } = this.props
    const { open } = this.state
    return (
      <div className="menu-button-container">
        <button>{buttonIcon}</button>
        {open && items.length > 0 && (
          <div className="menu-content">
            {items.map(item => (
              <div className="menu-item" role="button" onClick={item.onClick}>
                {item.icon}
                {item.text}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
}

export default MenuButton
