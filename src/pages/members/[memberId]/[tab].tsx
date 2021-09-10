import { MemberTabs } from 'components/member'
import { useGetMemberInfo } from 'graphql/use-get-member-info'
import React from 'react'
import { RouteComponentProps } from 'react-router'

export const MemberPage: React.FC<RouteComponentProps<{
  memberId: string
  tab: string
}>> = (props) => {
  const memberId = props.match.params.memberId
  const [member] = useGetMemberInfo(memberId)

  if (!member) {
    return null
  }

  return <MemberTabs {...props} member={member} />
}
