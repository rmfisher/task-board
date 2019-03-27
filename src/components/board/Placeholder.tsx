import React from 'react'
import './Placeholder.scss'

interface PlaceholderProps {
  initialHeight: number
  finalHeight: number
  animate?: boolean
}

interface PlaceholderState {
  height: number
}

class Placeholder extends React.Component<PlaceholderProps, PlaceholderState> {
  public readonly state = { height: this.props.animate ? this.props.initialHeight : this.props.finalHeight }

  public componentDidMount() {
    if (this.props.animate) {
      this.startAnimation()
    }
  }

  public render() {
    return <div className="placeholder" style={{ height: this.state.height }} />
  }

  private startAnimation() {
    const height = this.props.finalHeight
    if (height !== undefined) {
      setTimeout(() => this.setState({ height }), 1)
    }
  }
}

export default Placeholder
