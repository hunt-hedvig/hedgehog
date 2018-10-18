import ClaimTypeFields from 'components/claims/claim-info/ClaimTypeFields'
import { getMemberFullName } from 'lib/helpers'
import { claimStatus } from 'lib/selectOptions'
import * as moment from 'moment'
import * as PropTypes from 'prop-types'
import * as React from 'react'
import { Card, Form, Grid, Segment } from 'semantic-ui-react'
import styled from 'styled-components'

const DetailsSegment = styled(Segment)`
  &&& {
    padding: 30px;
  }
`

export const FormSelect = styled(Form.Select)`
  &&& {
    width: 196px;
  }
`

export default class ClaimInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      status: 'OPEN',
    }
  }

  public getRegistrationDate = (date) => {
    return `Registration date: ${moment(date)
      .local()
      .format('DD MMMM YYYY HH:mm')}`
  }

  public statusChangeHandler = (e, { value }) => {
    const {
      match: { params },
      claimUpdate,
    } = this.props
    this.setState({ status: value })
    claimUpdate(params.id, { state: value }, 'state')
  }

  public componentDidMount() {
    const {
      claimDetails: { data },
    } = this.props
    this.setState({ status: data.state })
  }

  public render() {
    const {
      member,
      types,
      match,
      claimDetails: { data },
      claimUpdate,
      claimDetailsUpdate,
    } = this.props
    const { status } = this.state
    return (
      <React.Fragment>
        <DetailsSegment>
          <Grid>
            <Grid.Row>
              <Card
                fluid={true}
                header={member ? getMemberFullName(member) : 'Member Name'}
                description={this.getRegistrationDate(data.date)}
              />
            </Grid.Row>
            <Grid.Row>
              <a href={data.audioURL} target="_blank">
                Link to claim file
              </a>
            </Grid.Row>
            <Grid.Row>
              <Form>
                <FormSelect
                  onChange={this.statusChangeHandler}
                  options={claimStatus}
                  placeholder="Status"
                  label="Status"
                  value={status}
                  selection
                />
              </Form>
            </Grid.Row>
          </Grid>
        </DetailsSegment>
        <Segment>
          {types.length && (
            <ClaimTypeFields
              claimId={match.params.id}
              types={types}
              claimInfo={data}
              claimTypeUpdate={claimUpdate}
              claimDetailsUpdate={claimDetailsUpdate}
            />
          )}
        </Segment>
      </React.Fragment>
    )
  }
}

ClaimInfo.propTypes = {
  member: PropTypes.object.isRequired,
  claimUpdate: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  types: PropTypes.array.isRequired,
  claimDetails: PropTypes.object.isRequired,
  claimDetailsUpdate: PropTypes.func.isRequired,
}
