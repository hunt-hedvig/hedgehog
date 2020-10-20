import { MajorLoadingMessage } from 'hedvig-ui/animations/major-message'
import React from 'react'
import { Header } from 'semantic-ui-react'
import { ClaimSearchFilter, ClaimsStore } from 'store/types/claimsTypes'
import BackendServedClaimsList from './claims-list/BackendServedClaimsList'

export interface ClaimsProps {
  claims: ClaimsStore
  claimsRequest: (filter: ClaimSearchFilter) => void
}

const Claims: React.FC<ClaimsProps> = (props) => {
  const { claimsRequest, claims } = props

  const initClaims = () => claimsRequest(claims.searchFilter)

  React.useEffect(() => {
    initClaims()
  }, [])

  if (claims.searchResult.claims.length === 0) {
    return <MajorLoadingMessage>Loading</MajorLoadingMessage>
  }

  return (
    <>
      <Header size="huge">Claims List</Header>
      <BackendServedClaimsList {...props} />
    </>
  )
}

export default Claims
