import * as React from "react";
import * as PropTypes from "prop-types";
import { Header } from "semantic-ui-react";
import ClaimsList from "./claims-list/ClaimsList";
export default class Claims extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { claimsRequest } = this.props;
    claimsRequest();
  }

  render() {
    return (
      <React.Fragment>
        <Header size="huge">Claims List</Header>
        <ClaimsList {...this.props} />
      </React.Fragment>
    );
  }
}

Claims.propTypes = {
  claimsRequest: PropTypes.func.isRequired,
  claims: PropTypes.object.isRequired
};
