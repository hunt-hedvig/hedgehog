import { getSum } from 'lib/helpers'
import * as PropTypes from 'prop-types'
import * as React from 'react'
import { Button, Form, Segment } from 'semantic-ui-react'
import styled from 'styled-components'
import PaymentsList from './PaymentsList'

const Label = styled.label`
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: 13px;
`
export default class Payments extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      reserve: '',
      editDisabled: true,
    }
  }

  public editClickHandler = () => {
    this.setState({ editDisabled: false })
  }

  public updateReserve = () => {
    const { id, updateReserve, claimDetails } = this.props

    updateReserve(id, { amount: this.state.reserve }, claimDetails.userId)
    this.setState({
      editDisabled: true,
    })
  }

  public reserveChangeHandler = (e, { value }) => {
    this.setState({ reserve: value })
  }

  public componentWillReceiveProps({ claimDetails: { data } }) {
    if (data && data.reserve) {
      this.setState({ reserve: data.reserve })
    }
  }

  public render() {
    const { claimDetails } = this.props
    const { reserve, editDisabled } = this.state
    const sum = getSum(claimDetails.payments)
    return (
      <Segment>
        <Form>
          <Form.Group>
            <Label>Reserves: </Label>
            <Form.Input
              type="number"
              value={reserve}
              disabled={editDisabled}
              onChange={this.reserveChangeHandler}
            />

            {editDisabled ? (
              <Button onClick={this.editClickHandler} content="Edit" />
            ) : (
              <Button primary onClick={this.updateReserve} content="Save" />
            )}
          </Form.Group>
        </Form>

        <PaymentsList {...this.props} list={claimDetails.payments} sum={sum} />
      </Segment>
    )
  }
}

Payments.propTypes = {
  claimDetails: PropTypes.object.isRequired,
  updateReserve: PropTypes.func.isRequired,
  createPayment: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  notes: PropTypes.array,
}
