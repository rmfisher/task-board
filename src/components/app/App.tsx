import React from 'react'
import WebFont from 'webfontloader'
import Header from '../header/Header'
import TaskBoard from '../board/TaskBoard'
import { Category, initialState } from '../../state'
import './App.scss'

WebFont.load({
  google: {
    families: ['Lato:400,700,900'],
  },
})

interface AppState {
  data: Category[]
}

class App extends React.Component<{}, AppState> {
  public readonly state: AppState = { data: initialState.categories }

  public render() {
    return (
      <React.Fragment>
        <Header users={initialState.users} />
        <TaskBoard data={this.state.data} onChange={this.handleChange} />
      </React.Fragment>
    )
  }

  private handleChange = (data: Category[]) => {
    this.setState({ data })
  }
}

export default App
