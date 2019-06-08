import React from 'react'
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
  private containerElement!: HTMLDivElement

  public componentDidMount() {
    this.containerElement.addEventListener('mousedown', this.handleContainerMouseDown)
    document.addEventListener('mousedown', this.handleDocumentMouseDown, true)
    document.addEventListener('keydown', this.handleDocumentKeyDown, true)
  }

  public componentWillUnmount() {
    this.containerElement.removeEventListener('mousedown', this.handleContainerMouseDown)
    document.removeEventListener('mousedown', this.handleDocumentMouseDown, true)
    document.removeEventListener('keydown', this.handleDocumentKeyDown, true)
  }

  public render() {
    const { className, buttonContent, items } = this.props
    const { open } = this.state
    return (
      <div
        className={'menu-button-container' + (className ? ' ' + className : '') + (open ? ' open' : '')}
        ref={e => (this.containerElement = e as HTMLDivElement)}
      >
        <button className="menu-button" onClick={this.handleButtonClick}>
          {buttonContent}
        </button>
        {open && items.length > 0 && (
          <div className="menu-anchor">
            <div className="menu-content">
              {items.map(item => (
                <div
                  key={item.text}
                  className="menu-item"
                  role="button"
                  onClick={() => this.handleItemClick(item.onClick)}
                >
                  {item.text}
                </div>
              ))}
            </div>
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
    if (this.state.open && e.target instanceof Node && !this.containerElement.contains(e.target)) {
      this.setState({ open: false })
    }
  }

  private handleDocumentKeyDown = (e: KeyboardEvent) => {
    if (this.state.open && (e.key === 'Escape' || e.keyCode === 27)) {
      this.setState({ open: false })
    }
  }

  private handleItemClick = (itemOnClick: () => void) => {
    this.setState({ open: false })
    itemOnClick()
  }
}

export default MenuButton
