import styled from '@emotion/styled'
import React from 'react'
import { MemberTabs } from 'portals/hope/features/member'

const Wrapper = styled.div`
  padding: 2rem 3rem 10rem;
`

export const MemberContainer: React.FC<{
  memberId: string
  tab: string
  onChangeTab: (newTab: string) => void
  title?: string
}> = ({ memberId, tab, onChangeTab, title }) => {
  return (
    <Wrapper>
      <MemberTabs
        memberId={memberId}
        tab={tab}
        onChangeTab={onChangeTab}
        chat={false}
        title={title}
      />
    </Wrapper>
  )
}
