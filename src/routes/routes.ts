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
  { path: '/payments', Component: Routes.PaymentsPageRoute, exact: true },
  { path: '/dashboard', Component: Routes.DashboardPageRoute, exact: true },
]