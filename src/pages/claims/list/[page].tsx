import styled from '@emotion/styled'
import { FadeIn } from '@hedvig-ui'
import { LargeClaimsList } from 'components/claims/claims-list/components/LargeClaimsList'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import { Header } from 'semantic-ui-react'

const ListPage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 0;
`

export const ClaimsPage: React.FC<RouteComponentProps<{
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
        <Header size="huge">Claims</Header>
      </FadeIn>

      <LargeClaimsList page={selectedPage} />
    </ListPage>
  )
}
