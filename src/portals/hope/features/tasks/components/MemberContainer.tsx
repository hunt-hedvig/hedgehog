import styled from '@emotion/styled'
import React, { useState } from 'react'
import { MemberTabs } from 'portals/hope/features/member'

const Wrapper = styled.div`
  padding: 2rem 3rem 10rem;
`

export const MemberContainer: React.FC<{ memberId: string }> = ({
  memberId,
}) => {
  const [tab, setTab] = useState('contracts')

  return (
    <Wrapper>
      <MemberTabs
        memberId={memberId}
        tab={tab}
        onChangeTab={(newTab) => setTab(newTab)}
        chat={false}
      />
    </Wrapper>
  )
}
