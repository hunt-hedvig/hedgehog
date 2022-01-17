import React from 'react'
import { hot } from 'react-hot-loader/root'
import { Routes } from 'portals/sos/pages/routes'

const App: React.FC = () => {
  return <Routes />
}

export const SOSHotApp = hot(App)
