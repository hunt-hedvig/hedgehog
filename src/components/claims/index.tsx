import * as React from 'react'
import { Header } from 'semantic-ui-react'
import { ClaimSearchFilter, ClaimsStore } from '../../store/types/claimsTypes'
import BackendServedClaimsList from './claims-list/BackendServedClaimsList'

export interface ClaimsProps {
  claims: ClaimsStore
  claimsRequest: (filter: ClaimSearchFilter) => void
}

export default class Claims extends React.Component<ClaimsProps> {
  constructor(props: ClaimsProps) {
    super(props)
  }

  public componentDidMount() {
    const { claimsRequest, claims } = this.props
    claimsRequest(claims.searchFilter)
  }

  public render() {
    return (
      <React.Fragment>
        <Header size="huge">Claims List</Header>
        <BackendServedClaimsList {...this.props} />
      </React.Fragment>
    )
  }
}
