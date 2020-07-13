import assets from './assetsReducer'
import auth from './authReducer'
import claimDetails from './claimDetailsReducer'
import claims from './claimsReducer'
import client from './clientReducer'
import dashboard from './dashboardReducer'
import login from './loginReducer'
import members from './membersReducer'
import messages from './messagesReducer'
import notifications from './notificationsReducer'
import payoutDetails from './payoutDetailsReducer'
import poll from './pollReducer'
import questions from './questionsReducer'

export default {
  auth,
  login,
  assets,
  poll,
  client,
  messages,
  members,
  dashboard,
  claims,
  claimDetails,
  payoutDetails,
  questions,
  notifications,
}
