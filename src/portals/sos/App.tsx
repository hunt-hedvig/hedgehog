import React from 'react'
import { hot } from 'react-hot-loader/root'
import { history } from 'clientEntry'
import { Router } from 'react-router'
import { Routes } from 'portals/sos/pages/routes'

const App: React.FC = () => {
  return (
    <Router history={history}>
      <Routes />
    </Router>
  )
}

export const SOSHotApp = hot(App)
