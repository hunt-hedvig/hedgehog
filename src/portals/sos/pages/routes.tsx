import React, { lazy, Suspense } from 'react'
import { Route, Switch } from 'react-router'

export type Page<T> = React.FC<T>

const MainPage = lazy(() => import('./MainPage'))

export const Routes: React.FC = () => {
  return (
    <Suspense fallback={<div />}>
      <Switch>
        <Route path="/" component={MainPage} />
      </Switch>
    </Suspense>
  )
}
