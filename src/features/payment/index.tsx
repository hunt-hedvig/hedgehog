import { Checkmark, Cross } from 'components/icons'
import gql from 'graphql-tag'
import * as moment from 'moment'
import * as React from 'react'
import { Query } from 'react-apollo'
import styled from 'react-emotion'
import MonthPickerInput from 'react-month-picker-input'
import { Table } from 'semantic-ui-react'
import { history } from 'store'
import { monthPickerStyles } from './_payment'

const DatePickerContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const query = gql`
  query MonthlyPaymentsQuery($month: YearMonth!) {
    monthlyPayments(month: $month) {
      amount
      member {
        memberId
        firstName
        lastName
        directDebitStatus {
          activated
        }
      }
    }
  }
`

const goToMember = (memberId) => () =>
  history.push(`/members/${memberId}`, { to: 'payments' })

const MonthlyPaymentsTable = ({ monthlyPayments }) => (
  <Table celled selectable compact>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>memberId</Table.HeaderCell>
        <Table.HeaderCell>Full name</Table.HeaderCell>
        <Table.HeaderCell>Subscription cost</Table.HeaderCell>
        <Table.HeaderCell>Direct Debit activated?</Table.HeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {monthlyPayments.map((monthlyPayment) => (
        <Table.Row
          key={`${monthlyPayment.member.memberId}:${
            monthlyPayment.amount.amount
          }`}
        >
          <Table.Cell
            selectable
            onClick={goToMember(monthlyPayment.member.memberId)}
          >
            {monthlyPayment.member.memberId}
          </Table.Cell>
          <Table.Cell>
            {monthlyPayment.member.firstName} {monthlyPayment.member.lastName}
          </Table.Cell>
          <Table.Cell>
            {monthlyPayment.amount.amount} {monthlyPayment.amount.currency}
          </Table.Cell>
          <Table.Cell>
            {monthlyPayment.member.directDebitStatus.activated ? (
              <Checkmark />
            ) : (
              <Cross />
            )}
          </Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
)

class Payment extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      date: moment().format('YYYY-MM'),
      defaultYear: Number(moment().format('YYYY')),
      defaultMonth: Number(moment().format('MM')) - 1,
    }
  }

  public onDateChange = (maskedValue, selectedYear, selectedMonth) => {
    // The range of the selectedMonth from MonthPickerInput is 0-11
    const month = (+selectedMonth + 1).toString()

    if (month.length === 1) {
      this.setState({ date: `${selectedYear}-0${month}` })
    } else {
      this.setState({ date: `${selectedYear}-${month}` })
    }
  }

  public render() {
    return (
      <React.Fragment>
        <DatePickerContainer className={monthPickerStyles}>
          <MonthPickerInput
            onChange={this.onDateChange}
            year={this.state.defaultYear}
            month={this.state.defaultMonth}
            closeOnSelect={true}
          />
        </DatePickerContainer>
        {this.state.date && (
          <React.Fragment>
            <Query query={query} variables={{ month: this.state.date }}>
              {({ loading, error, data }) => {
                if (error) {
                  return <div>Error!</div>
                }
                if (loading || !data) {
                  return <div>Loading...</div>
                }

                return (
                  <MonthlyPaymentsTable
                    monthlyPayments={data.monthlyPayments}
                  />
                )
              }}
            </Query>
          </React.Fragment>
        )}
      </React.Fragment>
    )
  }
}

export default Payment
