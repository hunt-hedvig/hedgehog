import * as PropTypes from 'prop-types'
import * as React from 'react'
import { Header, Segment, Table } from 'semantic-ui-react'
import PaymentCreator from './PaymentCreator'
import PaymentRow from './PaymentRow'

const PayoutsList = (props) => (
  <React.Fragment>
    <Segment clearing>
      <Header as="h2" floated="left">
        Payments
      </Header>
      <Header as="h2" floated="right">
        <PaymentCreator
          createPayment={props.createPayment}
          id={props.id}
          userId={props.claimDetails.userId}
        />
      </Header>

      <React.Fragment>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Amount</Table.HeaderCell>
              <Table.HeaderCell>Note</Table.HeaderCell>
              <Table.HeaderCell>Date</Table.HeaderCell>
              <Table.HeaderCell>Ex Gratia</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {props.list.length ? (
              props.list.map((item, id) => (
                <Table.Row key={item.id || id}>
                  <PaymentRow {...props} data={item} />
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell>No payments</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </React.Fragment>

      <span>Total payed out: {props.sum || 0} SEK</span>
    </Segment>
  </React.Fragment>
)

PayoutsList.propTypes = {
  list: PropTypes.array.isRequired,
  createPayment: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  sum: PropTypes.number,
  claimDetails: PropTypes.object,
}

export default PayoutsList
