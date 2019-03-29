import React from 'react'
import './Placeholder.scss'

interface PlaceholderProps {
  height: number
  expanded: boolean
}

interface PlaceholderState {
  height: number
}

class Placeholder extends React.Component<PlaceholderProps, PlaceholderState> {
  public readonly state = { height: this.props.expanded ? this.props.height : 0 }

  public componentDidUpdate(prevProps: PlaceholderProps) {
    if (prevProps.expanded !== this.props.expanded) {
      this.setState({ height: this.props.expanded ? this.props.height : 0 })
    }
  }

  public render() {
    const { expanded } = this.props
    const { height } = this.state
    // Placeholder is a span in order to use :last-of-type CSS selector.
    return (
      <span className={'placeholder' + (expanded ? ' expanded' : '')} style={{ height }}>
        <div className="placeholder-fill" />
      </span>
    )
  }
}

export default Placeholder
