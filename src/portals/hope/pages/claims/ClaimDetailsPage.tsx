import React from 'react'
import { RouteComponentProps } from 'react-router'
import { Page } from 'portals/hope/pages/routes'
import { ClaimOverview } from 'portals/hope/features/claims/ClaimOverview'

const ClaimDetailsPage: Page<
  RouteComponentProps<{
    claimId: string
  }>
> = ({
  match: {
    params: { claimId },
  },
}) => {
  return <ClaimOverview claimId={claimId} />
}

export default ClaimDetailsPage
