import { MemberTabs } from 'features/member'
import { useGetMemberInfo } from 'features/member/tabs/member-tab/hooks/use-get-member-info'
import React from 'react'
import { RouteComponentProps } from 'react-router'

const MemberPage: React.FC<RouteComponentProps<{
  memberId: string
}>> = (props) => {
  const memberId = props.match.params.memberId
  const [member] = useGetMemberInfo(memberId)

  if (!member) {
    return null
  }

  return <MemberTabs {...props} member={member} />
}

export default MemberPage
