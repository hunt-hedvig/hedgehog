import ClaimsList from 'components/claims/claims-list/ClaimsList'
import * as PropTypes from 'prop-types'
import * as React from 'react'
import { Header } from 'semantic-ui-react'

export default class ClaimsTab extends React.Component {
  constructor(props) {
    super(props)
  }

  public render() {
    const { memberClaims, sortClaimsList } = this.props

    return memberClaims.length > 0 ? (
      <ClaimsList
        claims={{ list: memberClaims }}
        sortClaimsList={sortClaimsList}
      />
    ) : (
      <Header>Claims list is empty</Header>
    )
  }
}

ClaimsTab.propTypes = {
  memberClaims: PropTypes.array,
  sortClaimsList: PropTypes.func,
}
