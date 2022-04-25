import styled from '@emotion/styled'
import React from 'react'
import { ClaimOverview } from 'portals/hope/features/claims/ClaimOverview'
import { ClaimDetailsQuery } from 'types/generated/graphql'

const Wrapper = styled.div`
  padding: 2rem 3rem 10rem;
`

export const ClaimContainer: React.FC<{
  claimId: string
  onMounted?: (claim: ClaimDetailsQuery['claim']) => void
}> = ({ claimId, onMounted }) => {
  return (
    <Wrapper>
      <ClaimOverview
        claimId={claimId}
        standalone={true}
        onMounted={onMounted}
      />
    </Wrapper>
  )
}
