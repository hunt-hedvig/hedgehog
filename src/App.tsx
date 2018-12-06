import DateFnsUtils from '@date-io/date-fns'
import Navigation from 'components/shared/navigation'
import Notifications from 'containers/notification-service/NotificationService'
import { injectGlobal } from 'emotion'
import { MuiPickersUtilsProvider } from 'material-ui-pickers'
import * as React from 'react'
import { hot } from 'react-hot-loader'
import { Provider } from 'react-redux'
import { Redirect, Route, Router, Switch } from 'react-router'
import Routes from 'routes'
import Store, { history } from 'store'

const store = Store.configureStore()

declare var window: any
if (process.env.NODE_ENV !== 'production') {
  if (typeof window !== 'undefined') {
    window.__store = store
  }
}

const GlobalCss: React.SFC = ({ children }) => {
  // tslint:disable-next-line no-unused-expression
  injectGlobal`
    #react-root {
      height: 100%
    }
  `
  return <>{children}</>
}

const App: React.SFC = () => (
  <>
    <GlobalCss />
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
                path="/payments"
                store={store}
                component={Routes.PaymentsPageRoute}
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
  </>
)

export default App
export const HotApp = hot(module)(App)
