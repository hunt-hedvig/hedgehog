import * as assets from './assets'
import * as claims from './claims'
import * as login from './login'
import * as members from './members'

export default {
  ...assets,
  ...members,
  ...claims,
  ...login,
}
