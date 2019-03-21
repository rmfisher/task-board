import React from 'react'
import WebFont from 'webfontloader'
import Header from '../header/Header'
import TaskBoard from '../board/TaskBoard'
import initialState from '../../state/initialState'
import './App.scss'

WebFont.load({
  google: {
    families: ['Lato:400,700,900'],
  },
})

const App: React.FunctionComponent = () => (
  <React.Fragment>
    <Header users={initialState.users} />
    <TaskBoard categories={initialState.categories} />
  </React.Fragment>
)

export default App
