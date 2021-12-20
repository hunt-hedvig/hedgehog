import { useTitle } from '@hedvig-ui/hooks/use-title'
import { MemberTabs } from 'features/member'
import { useGetMemberInfo } from 'features/member/tabs/member-tab/hooks/use-get-member-info'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import { Page } from 'pages/routes'

const MemberPage: Page<
  RouteComponentProps<{
    memberId: string
  }>
> = (props) => {
  const memberId = props.match.params.memberId
  const [member] = useGetMemberInfo(memberId)

  useTitle(member ? `${member?.firstName} ${member?.lastName}` : 'Loading...')

  if (!member) {
    return null
  }

  return <MemberTabs {...props} member={member} />
}

export default MemberPage
