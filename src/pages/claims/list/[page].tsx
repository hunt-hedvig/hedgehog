import { FadeIn } from '@hedvig-ui'
import { LargeClaimsList } from 'components/claims/claims-list/components/LargeClaimsList'
import { ListPage } from 'components/shared'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import { Header } from 'semantic-ui-react'

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
