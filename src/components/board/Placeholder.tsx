import React from 'react'
import './Placeholder.scss'

interface PlaceholderProps {
  height: number
  expanded: boolean
}

interface PlaceholderState {
  height: number
  animating: boolean
}

class Placeholder extends React.Component<PlaceholderProps, PlaceholderState> {
  public readonly state = { height: this.props.expanded ? this.props.height : 0, animating: false }

  private rootElement!: HTMLDivElement

  public componentDidMount() {
    this.rootElement.addEventListener('animationend', this.handleAnimationEnd)
  }

  public componentWillUnmount() {
    this.rootElement.removeEventListener('animationend', this.handleAnimationEnd)
  }
  public componentDidUpdate(prevProps: PlaceholderProps) {
    if (prevProps.expanded !== this.props.expanded) {
      this.setState({ height: this.props.expanded ? this.props.height : 0, animating: true })
    }
  }

  public render() {
    return (
      <span
        className="placeholder"
        style={{ height: this.state.height }}
        ref={e => (this.rootElement = e as HTMLDivElement)}
      >
        <div className="placeholder-fill" />
      </span>
    )
  }

  private handleAnimationEnd() {
    this.setState({ animating: false })
  }
}

export default Placeholder
