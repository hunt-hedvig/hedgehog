import Routes from './index'

export const reactPageRoutes = [
  { path: '/login', Component: Routes.LoginPageRoute, exact: true },
  { path: '/login/**', Component: Routes.LoginPageRoute, exact: true },
  {
    path: '/login/process',
    Component: Routes.LoginProcessPageRoute,
    exact: true,
  },
  { path: '/assets', Component: Routes.AssetsPageRoute, exact: true },
  { path: '/members/**', Component: Routes.MembersPageRoute, exact: true },
  { path: '/members', Component: Routes.MembersPageRoute, exact: true },
  {
    path: '/member_insurance/**',
    Component: Routes.MemberInsurancePageRoute,
    exact: true,
  },
  {
    path: '/member_insurance',
    Component: Routes.MemberInsurancePageRoute,
    exact: true,
  },
  { path: '/claims/**', Component: Routes.ClaimsPageRoute, exact: true },
  { path: '/claims', Component: Routes.ClaimsPageRoute, exact: true },
  { path: '/questions/**', Component: Routes.QuestionsPageRoute, exact: true },
  { path: '/questions', Component: Routes.QuestionsPageRoute, exact: true },
  { path: '/charges', Component: Routes.ChargePageRoute, exact: true },
  { path: '/taskmanager', Component: Routes.TaskManagerPageRoute, exact: true },
  {
    path: '/ticket_history/:id',
    Component: Routes.TicketHistoryPageRoute,
    exact: true,
  },
  { path: '/dashboard', Component: Routes.DashboardPageRoute, exact: true },
  { path: '/tools', Component: Routes.ToolsPageRoute, exact: true },
]
