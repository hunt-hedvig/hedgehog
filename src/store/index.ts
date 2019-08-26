/* eslint-env browser */
/* global Raven, process*/
import * as history_ from 'history'
import { routerMiddleware, routerReducer } from 'react-router-redux'
import { applyMiddleware, combineReducers, createStore } from 'redux'
import { reducer as reduxFormReducer } from 'redux-form'
import createSagaMiddleware from 'redux-saga'
import reducers from './reducers'
import rootSaga from './sagas'

export const history =
  typeof window !== 'undefined'
    ? history_.createBrowserHistory()
    : history_.createMemoryHistory()

const rootReducer = combineReducers({
  ...reducers,
  form: reduxFormReducer,
  routing: routerReducer,
})

const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware({
    onError: (e) => {
      if (window.Raven && process.env.NODE_ENV === 'production') {
        Raven.captureException(e)
      }
    },
  })
  const router = routerMiddleware(history)
  return {
    ...createStore(rootReducer, applyMiddleware(sagaMiddleware, router)),
    runSaga: sagaMiddleware.run(rootSaga),
  }
}

export default {
  configureStore,
}
