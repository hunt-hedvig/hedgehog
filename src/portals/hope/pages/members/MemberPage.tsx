import { MemberTabs } from 'portals/hope/features/member'
import React from 'react'
import { RouteComponentProps, useHistory } from 'react-router'
import { Page } from 'portals/hope/pages/routes'
import { ChatPane } from 'portals/hope/features/member/tabs/ChatPane'

const MemberPage: Page<
  RouteComponentProps<{
    memberId: string
    tab?: string
  }>
> = ({ match }) => {
  const history = useHistory()
  const memberId = match.params.memberId
  const tab = match.params.tab

  return (
    <>
      <MemberTabs
        memberId={memberId}
        tab={tab ?? 'contracts'}
        onChangeTab={(newTab) =>
          history.replace(`/members/${memberId}/${newTab}`)
        }
      />
      <ChatPane memberId={memberId} />
    </>
  )
}

export default MemberPage
