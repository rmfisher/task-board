import React from 'react'
import Popup from './Popup'
import './MenuButton.scss'

interface MenuItemProps {
  text: string
  onClick: () => void
}

interface MenuButtonProps {
  className: string
  buttonContent: React.ReactNode
  items: Array<MenuItemProps>
  disabled: boolean
}

interface MenuButtonState {
  open: boolean
}

class MenuButton extends React.Component<MenuButtonProps, MenuButtonState> {
  public readonly state = { open: false }

  public render() {
    const { className, buttonContent, items } = this.props
    const { open } = this.state
    return (
      <Popup
        className={'menu-button-container' + (className ? ' ' + className : '')}
        open={open}
        onCloseRequested={this.close}
        anchor={
          <button className="menu-button" onClick={this.handleButtonClick}>
            {buttonContent}
          </button>
        }
      >
        {items.map(item => (
          <button
            key={item.text}
            className="menu-item"
            role="button"
            onClick={() => this.handleItemClick(item.onClick)}
          >
            {item.text}
          </button>
        ))}
      </Popup>
    )
  }

  private handleButtonClick = () => {
    if (!this.props.disabled) {
      this.setState({ open: !this.state.open })
    }
  }

  private close = () => this.setState({ open: false })

  private handleItemClick = (itemOnClick: () => void) => {
    this.close()
    itemOnClick()
  }
}

export default MenuButton
