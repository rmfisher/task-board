import React from 'react'
import './Popup.scss'

interface PopupProps {
  className: string
  open: boolean
  onCloseRequested: () => void
  anchor: React.ReactNode
  children: React.ReactNode | React.ReactNodeArray
}

class Popup extends React.Component<PopupProps> {
  private rootElement!: HTMLDivElement

  public componentDidMount() {
    document.addEventListener('mousedown', this.handleDocumentMouseDown, true)
    document.addEventListener('keydown', this.handleDocumentKeyDown, true)
  }

  public componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleDocumentMouseDown, true)
    document.removeEventListener('keydown', this.handleDocumentKeyDown, true)
  }

  public render() {
    const { className, anchor, open, children } = this.props
    return (
      <div
        className={'popup-container' + (className ? ' ' + className : '') + (open ? ' open' : '')}
        ref={e => (this.rootElement = e as HTMLDivElement)}
      >
        {anchor}
        {open && children && (
          <div className="popup-positioner">
            <div className="popup-content">{children}</div>
          </div>
        )}
      </div>
    )
  }

  private handleDocumentMouseDown = (e: MouseEvent) => {
    if (this.props.open && e.target instanceof Node && !this.rootElement.contains(e.target)) {
      this.props.onCloseRequested()
    }
  }

  private handleDocumentKeyDown = (e: KeyboardEvent) => {
    if (this.props.open) {
      const escape = e.key === 'Escape' || e.keyCode === 27
      const enter = e.key === 'Enter' || e.keyCode === 13
      const focusInside = this.rootElement && this.rootElement.contains(document.activeElement)
      if (escape || (enter && !focusInside)) {
        this.props.onCloseRequested()
      }
    }
  }
}

export default Popup
