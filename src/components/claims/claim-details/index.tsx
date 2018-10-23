import ClaimInfo from 'components/claims/claim-info/ClaimInfo'
import * as PropTypes from 'prop-types'
import * as React from 'react'
import { Header } from 'semantic-ui-react'
import styled from 'styled-components'
import EventsLog from '../events-log/EventsLog'
import Notes from '../notes/Notes'
import Payments from '../payments/Payments'

const ClaimDetailsContainer = styled.div`
  max-width: 600px;
  margin: 0 auto 50px;
`
export default class ClaimDetails extends React.Component {
  constructor(props) {
    super(props)
  }

  public componentDidMount() {
    const { match, memberRequest, claimRequest, claimTypes } = this.props
    const id = match.params.id
    const userId = match.params.userId
    claimRequest(id)
    memberRequest(userId)
    claimTypes()
  }

  public render() {
    const {
      claimDetails: { data },
      createNote,
      updateReserve,
      createPayment,
      match,
    } = this.props
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
    )
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
  memberRequest: PropTypes.func.isRequired,
}
