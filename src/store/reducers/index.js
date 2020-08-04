import assets from './assetsReducer'
import auth from './authReducer'
import claimDetails from './claimDetailsReducer'
import claims from './claimsReducer'
import client from './clientReducer'
import dashboard from './dashboardReducer'
import login from './loginReducer'
import members from './membersReducer'
import notifications from './notificationsReducer'
import payoutDetails from './payoutDetailsReducer'
import poll from './pollReducer'

export default {
  auth,
  login,
  assets,
  poll,
  client,
  members,
  dashboard,
  claims,
  claimDetails,
  payoutDetails,
  notifications,
}
