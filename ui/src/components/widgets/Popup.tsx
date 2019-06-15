import React from 'react'
import './Popup.scss'

const THRESHOLD_PADDING = 10

interface PopupProps {
  className: string
  open: boolean
  anchor: React.ReactNode
  children: React.ReactNode | React.ReactNodeArray
  onCloseRequested: () => void
}

interface PopupState {
  orientation: string | null
}

class Popup extends React.PureComponent<PopupProps, PopupState> {
  public readonly state = { orientation: null }
  private rootElementRef: React.RefObject<HTMLDivElement> = React.createRef()

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
    const { orientation } = this.state
    return (
      <div
        className={
          'popup-container' +
          (className ? ' ' + className : '') +
          (open ? ' open' : '') +
          (orientation ? ' ' + orientation : '')
        }
        ref={this.rootElementRef}
      >
        {anchor}
        {open && children && (
          <div className="popup-positioner">
            <div className="popup-content" ref={this.handlePopupChange}>
              {children}
            </div>
          </div>
        )}
      </div>
    )
  }

  private handleDocumentMouseDown = (e: MouseEvent) => {
    const rootElement = this.rootElementRef.current
    if (rootElement && this.props.open && e.target instanceof Node && !rootElement.contains(e.target)) {
      this.props.onCloseRequested()
    }
  }

  private handleDocumentKeyDown = (e: KeyboardEvent) => {
    if (this.props.open) {
      const escape = e.key === 'Escape' || e.keyCode === 27
      const enter = e.key === 'Enter' || e.keyCode === 13
      const rootElement = this.rootElementRef.current
      const focusInside = rootElement && rootElement.contains(document.activeElement)
      if (escape || (enter && !focusInside)) {
        this.props.onCloseRequested()
      }
    }
  }

  private checkOrientation = (contentWidth: number, contentHeight: number) => {
    const rootElement = this.rootElementRef.current
    if (rootElement) {
      const bounds = rootElement.getBoundingClientRect()
      const overflowRight = window.innerWidth - bounds.right < contentWidth + THRESHOLD_PADDING
      const overflowBelow = window.innerHeight - bounds.bottom < contentHeight + THRESHOLD_PADDING
      if (overflowRight && overflowBelow) {
        return 'overflow-right overflow-below'
      } else if (overflowRight) {
        return 'overflow-right'
      } else if (overflowBelow) {
        return 'overflow-below'
      }
    }
    return null
  }

  private handlePopupChange = (e: HTMLDivElement | null) => {
    const orientation = e ? this.checkOrientation(e.scrollWidth, e.scrollHeight) : null
    this.setState({ orientation })
  }
}

export default Popup
