import React from 'react'
import WebFont from 'webfontloader'
import Header from '../header/Header'
import TaskBoard from '../board/TaskBoard'
import BrowserCheck from './BrowserCheck'
import { Column, initialState } from '../../state'
import './App.scss'

WebFont.load({
  google: {
    families: ['Lato:400,700,900'],
  },
})

interface AppState {
  data: Column[]
}

class App extends React.Component<{}, AppState> {
  public readonly state: AppState = { data: initialState.columns }

  public render() {
    return (
      <BrowserCheck>
        <Header users={initialState.users} />
        <div className="task-board-overflow-container">
          <TaskBoard data={this.state.data} onChange={this.handleChange} />
        </div>
      </BrowserCheck>
    )
  }

  private handleChange = (data: Column[]) => {
    this.setState({ data })
  }
}

export default App
