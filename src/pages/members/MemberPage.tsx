import { useTitle } from '@hedvig-ui/hooks/use-title'
import { MemberTabs } from 'features/member'
import { useGetMemberInfo } from 'features/member/tabs/member-tab/hooks/use-get-member-info'
import {
  FocusItems,
  useNavigation,
} from 'features/navigation/hooks/use-navigation'
import React, { useEffect } from 'react'
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

  const { focus, setFocus } = useNavigation()

  useEffect(() => {
    if (!focus) {
      setFocus(FocusItems.Member.name)
    }
  }, [focus])

  if (!member) {
    return null
  }

  return (
    <MemberTabs
      {...props}
      member={member}
      navigationAvailable={focus === FocusItems.Member.name}
      setFocus={(value: string | null) => setFocus(value)}
      focus={focus}
    />
  )
}

export default MemberPage
