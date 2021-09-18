import styled from '@emotion/styled'
import { FadeIn, MainHeadline } from '@hedvig-ui'
import { LargeClaimsList } from 'features/claims/claims-list/components/LargeClaimsList'
import React from 'react'
import { RouteComponentProps } from 'react-router'

const ListPage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 0;
`

export const ClaimsListPage: React.FC<RouteComponentProps<{
  page?: string
}>> = ({
  match: {
    params: { page = '1' },
  },
}) => {
  const selectedPage = parseInt(page, 10)

  return (
    <ListPage>
      <FadeIn>
        <MainHeadline>Claims</MainHeadline>
      </FadeIn>

      <LargeClaimsList page={selectedPage} />
    </ListPage>
  )
}
