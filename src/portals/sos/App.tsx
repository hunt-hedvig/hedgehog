import React from 'react'
import { hot } from 'react-hot-loader/root'
import { history } from 'clientEntry'
import { Router } from 'react-router'

const App: React.FC = () => {
  return <Router history={history}>Hello SOS!</Router>
}

export const SOSHotApp = hot(App)
