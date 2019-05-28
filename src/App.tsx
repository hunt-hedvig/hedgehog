import DateFnsUtils from '@date-io/date-fns'
import { CssBaseline } from '@material-ui/core'
import { MuiThemeProvider } from '@material-ui/core/styles'
import Navigation from 'components/shared/navigation'
import Notifications from 'containers/notification-service/NotificationService'
import { MuiPickersUtilsProvider } from 'material-ui-pickers'
import * as React from 'react'
import { hot } from 'react-hot-loader'
import { Provider } from 'react-redux'
import { Redirect, Route, Router, Switch } from 'react-router'
import Routes from 'routes'
import Store, { history } from 'store'
import { lightUiTheme } from './uiThemes'

const store = Store.configureStore()

declare var window: any
if (process.env.NODE_ENV !== 'production') {
  if (typeof window !== 'undefined') {
    window.__store = store
  }
}

const App: React.SFC = () => (
  <MuiThemeProvider theme={lightUiTheme}>
    <CssBaseline />
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Provider store={store}>
        <Router history={history}>
          <>
            <Navigation history={history} store={store} />
            <Switch>
              <Route path="/login/oauth" component={Routes.LoginPageRoute} />
              <Route
                path="/login/process"
                component={Routes.LoginProcessPageRoute}
              />
              <Routes.PrivateRoute
                path="/assets"
                store={store}
                component={Routes.AssetsPageRoute}
              />
              <Routes.PrivateRoute
                path="/dashboard"
                store={store}
                component={Routes.DashboardPageRoute}
              />
              <Routes.PrivateRoute
                path="/questions"
                store={store}
                component={Routes.QuestionsPageRoute}
              />
              <Route
                path="/claims"
                render={(routeProps) => (
                  <Routes.ClaimsPageRoute {...routeProps} store={store} />
                )}
              />
              <Route
                path="/members"
                render={(routeProps) => (
                  <Routes.MembersPageRoute {...routeProps} store={store} />
                )}
              />
              <Routes.PrivateRoute
                path="/member_insurance"
                store={store}
                component={Routes.MemberInsurancePageRoute}
              />
              <Routes.PrivateRoute
                path="/charges"
                store={store}
                component={Routes.ChargePageRoute}
              />
              <Routes.PrivateRoute
                path="/BDX"
                store={store}
                component={Routes.BourdereauPageRoute}
              />
              <Redirect from="*" to="/dashboard" />
            </Switch>
            <Notifications />
          </>
        </Router>
      </Provider>
    </MuiPickersUtilsProvider>
  </MuiThemeProvider>
)

export default App
export const HotApp = hot(module)(App)
