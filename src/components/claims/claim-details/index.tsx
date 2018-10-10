import * as React from "react";
import * as PropTypes from "prop-types";
import styled from "styled-components";
import { Header } from "semantic-ui-react";
import ClaimInfo from "components/claims/claim-info/ClaimInfo";
import Notes from "../notes/Notes";
import Payments from "../payments/Payments";
import EventsLog from "../events-log/EventsLog";

const ClaimDetailsContainer = styled.div`
  max-width: 600px;
  margin: 0 auto 50px;
`;
export default class ClaimDetails extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { match, memberRequest, claimRequest, claimTypes } = this.props;
    const id = match.params.id;
    const userId = match.params.userId;
    claimRequest(id);
    memberRequest(userId);
    claimTypes();
  }

  render() {
    const {
      claimDetails: { data },
      createNote,
      updateReserve,
      createPayment,
      match
    } = this.props;
    return (
      <ClaimDetailsContainer>
        <Header size="huge">Claim Details</Header>

        {data ? (
          <React.Fragment>
            <ClaimInfo {...this.props} />
            <Notes
              notes={data.notes}
              createNote={createNote}
              id={match.params.id}
            />
            <Payments
              claimDetails={data}
              updateReserve={updateReserve}
              createPayment={createPayment}
              id={match.params.id}
            />
            <EventsLog events={data.events} />
          </React.Fragment>
        ) : null}
      </ClaimDetailsContainer>
    );
  }
}

ClaimDetails.propTypes = {
  claimDetails: PropTypes.object.isRequired,
  createNote: PropTypes.func.isRequired,
  updateReserve: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  claimRequest: PropTypes.func.isRequired,
  claimTypes: PropTypes.func.isRequired,
  createPayment: PropTypes.func.isRequired,
  memberRequest: PropTypes.func.isRequired
};
