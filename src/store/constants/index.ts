import * as claims from './claims'
import * as login from './login'
import * as members from './members'

export default {
  ...members,
  ...claims,
  ...login,
}
