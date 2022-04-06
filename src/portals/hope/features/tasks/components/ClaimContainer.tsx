import styled from '@emotion/styled'
import React from 'react'
import { ClaimOverview } from 'portals/hope/features/claims/ClaimOverview'

const Wrapper = styled.div`
  padding: 2rem 3rem 10rem;
`

export const ClaimContainer: React.FC<{
  claimId: string
}> = ({ claimId }) => {
  return (
    <Wrapper>
      <ClaimOverview claimId={claimId} standalone={true} />
    </Wrapper>
  )
}
