import React from 'react'
import './MenuButton.scss'

interface MenuItem {
  icon: React.ReactNode
  text: string
  onClick: () => void
}

interface MenuButtonProps {
  className: string
  buttonIcon: React.ReactNode
  items: Array<MenuItem>
  disabled: boolean
}

interface MenuButtonState {
  open: boolean
}

class MenuButton extends React.Component<MenuButtonProps, MenuButtonState> {
  public readonly state = { open: false }
  private containerElement!: HTMLDivElement

  public componentDidMount() {
    this.containerElement.addEventListener('mousedown', this.handleContainerMouseDown)
    document.addEventListener('mousedown', this.handleDocumentMouseDown, true)
  }

  public componentWillUnmount() {
    this.containerElement.removeEventListener('mousedown', this.handleContainerMouseDown)
    document.removeEventListener('mousedown', this.handleDocumentMouseDown, true)
  }

  public render() {
    const { className, buttonIcon, items } = this.props
    const { open } = this.state
    return (
      <div
        className={'menu-button-container' + (className ? ' ' + className : '') + (open ? ' open' : '')}
        ref={e => (this.containerElement = e as HTMLDivElement)}
      >
        <button className="menu-button" onClick={this.handleButtonClick}>
          {buttonIcon}
        </button>
        {open && items.length > 0 && (
          <div className="menu-content">
            {items.map(item => (
              <div key={item.text} className="menu-item" role="button" onClick={item.onClick}>
                {item.icon}
                {item.text}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  private handleButtonClick = () => {
    if (!this.props.disabled) {
      this.setState({ open: !this.state.open })
    }
  }

  private handleContainerMouseDown = (e: MouseEvent) => {
    if (this.state.open) {
      e.stopPropagation()
    }
  }

  private handleDocumentMouseDown = (e: MouseEvent) => {
    if (e.target instanceof Node && !this.containerElement.contains(e.target)) {
      this.setState({ open: false })
    }
  }
}

export default MenuButton
