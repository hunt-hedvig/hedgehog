import { LargeClaimsList } from 'components/claims/claims-list/components/LargeClaimsList'
import { ListPage } from 'components/shared'
import { FadeIn } from 'hedvig-ui/animations/fade-in'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import { Header } from 'semantic-ui-react'

export const ClaimsList: React.FC<RouteComponentProps<{
  page?: string
}>> = ({ match }) => {
  const selectedPage = parseInt(match.params.page ?? '1', 10)

  return (
    <ListPage>
      <FadeIn>
        <Header size="huge">Claims</Header>
      </FadeIn>

      <LargeClaimsList page={selectedPage} />
    </ListPage>
  )
}
