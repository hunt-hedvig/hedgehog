import * as assets from './assets'
import * as claims from './claims'
import * as dashboard from './dashboard'
import * as login from './login'
import * as members from './members'

export default {
  ...assets,
  ...members,
  ...claims,
  ...dashboard,
  ...login,
}
