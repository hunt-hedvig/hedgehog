import { MemberTabs } from 'components/member'
import { useGetMemberInfo } from 'graphql/use-get-member-info'
import React from 'react'

export const MemberPage = (props) => {
  const memberId = props.match.params.memberId
  const [member] = useGetMemberInfo(memberId)

  if (!member) {
    return null
  }

  return <MemberTabs {...props} member={member} />
}
