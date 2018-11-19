import Breadcrumbs from 'components/shared/navigation/breadcrumbs/Breadcrumbs'
import * as PropTypes from 'prop-types'
import * as React from 'react'
import HorizontalMenu from './horizontal-menu/HorizontalMenu'

const menuIsHidden = (path) =>
  !!(path.indexOf('dashboard') + 1) || !!(path.indexOf('login') + 1)

const Navigation = ({ history, store }) =>
  !menuIsHidden(history.location.pathname) ? (
    <React.Fragment>
      <HorizontalMenu history={history} dispatch={store.dispatch} />
      <Breadcrumbs history={history} state={store.getState()} />
    </React.Fragment>
  ) : null

Navigation.propTypes = {
  history: PropTypes.object.isRequired,
  store: PropTypes.object,
}

export default Navigation