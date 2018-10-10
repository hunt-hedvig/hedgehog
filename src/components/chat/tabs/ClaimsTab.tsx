import * as React from "react";
import * as PropTypes from "prop-types";
import { Header } from "semantic-ui-react";
import ClaimsList from "components/claims/claims-list/ClaimsList";

export default class ClaimsTab extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { memberClaims, sortClaimsList } = this.props;

    return memberClaims.length > 0 ? (
      <ClaimsList
        claims={{ list: memberClaims }}
        sortClaimsList={sortClaimsList}
      />
    ) : (
      <Header>Claims list is empty</Header>
    );
  }
}

ClaimsTab.propTypes = {
  memberClaims: PropTypes.array,
  sortClaimsList: PropTypes.func
};
