import auth from './authReducer'
import claims from './claimsReducer'
import client from './clientReducer'
import login from './loginReducer'
import members from './membersReducer'
import notifications from './notificationsReducer'
import payoutDetails from './payoutDetailsReducer'

export default {
  auth,
  login,
  client,
  members,
  claims,
  payoutDetails,
  notifications,
}
