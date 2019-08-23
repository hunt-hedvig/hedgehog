import * as React from 'react'
import { VerticalMenu } from './sidebar/VerticalMenu'

const menuIsHidden = (path) => path.startsWith('/login')

export const Navigation = ({ history, store }) =>
  !menuIsHidden(history.location.pathname) ? (
    <VerticalMenu store={store} />
  ) : null
