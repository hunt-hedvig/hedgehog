import * as React from "react";
import * as PropTypes from "prop-types";
import { Header } from "semantic-ui-react";
import InsuranceList from "components/chat/insurance-list/InsuranceList";

export default class InsuranceListTab extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { insurance } = this.props;

    return insurance.list ? (
      <React.Fragment>
        <InsuranceList {...this.props} />
      </React.Fragment>
    ) : (
      <Header>No insurance info </Header>
    );
  }
}

InsuranceListTab.propTypes = {
  insurance: PropTypes.object.isRequired
};
