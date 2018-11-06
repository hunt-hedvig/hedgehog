import * as React from 'react'
import { Mount } from 'react-lifecycle-components/dist'
import { Header } from 'semantic-ui-react'
import { ClaimSearchFilter, ClaimsStore } from '../../store/types/claimsTypes'
import BackendServedClaimsList from './claims-list/BackendServedClaimsList'

export interface ClaimsProps {
  claims: ClaimsStore
  claimsRequest: (filter: ClaimSearchFilter) => void
}

const Claims: React.SFC<ClaimsProps> = (props) => {
  const { claimsRequest, claims } = props

  const initClaims = () => claimsRequest(claims.searchFilter)

  return (
    <Mount on={initClaims}>
      <React.Fragment>
        <Header size="huge">Claims List</Header>
        <BackendServedClaimsList {...props} />
      </React.Fragment>
    </Mount>
  )
}

export default Claims
