import React from 'react'
import WebFont from 'webfontloader'
import Header from '../header/Header'
import './App.scss'

WebFont.load({
  google: {
    families: ['Lato:400,700,900'],
  },
})

const App: React.FunctionComponent = () => <Header />

export default App
