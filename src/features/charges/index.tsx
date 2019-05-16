import * as React from 'react'
import styled from 'react-emotion'
import { Table } from 'semantic-ui-react'
import { formatMoneySE } from 'lib/intl'
import { colors } from '@hedviginsurance/brand'

const Wrapper = styled('div')({
  padding: '0 20px',
})

const TableRow = styled(Table.Row)((props: { warning: boolean }) => ({
  backgroundColor: props.warning ? 'yellow' : undefined,
}))

const ButtonWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end',
})

const Button = styled('button')({
  padding: '10px 15px',
  background: colors.GREEN,
  color: colors.WHITE,
  fontWeight: 600,
  border: 0,
  borderRadius: 5,
  fontSize: '1.2rem',
  transition: 'background 250ms',

  '&:hover, &:focus': {
    background: '#18cea1',
    cursor: 'pointer',
  },
})

const members = [
  {
    memberId: '123',
    memberName: 'test',
    premium: { amount: 100, currency: 'SEK' },
    amount: { amount: 100, currency: 'SEK' },
    lastChargeAmount: { amount: 100, currency: 'SEK' },
    lastChargeDate: '2019-04-27',
  },
  {
    memberId: '321',
    memberName: 'test 2',
    premium: { amount: 200, currency: 'SEK' },
    amount: { amount: 400, currency: 'SEK' },
    lastChargeAmount: { amount: 200, currency: 'SEK' },
    lastChargeDate: '2019-03-27',
  },
]

const buildRow = () =>
  members.map((member) => (
    <TableRow warning={member.premium.amount !== member.amount.amount}>
      <Table.Cell>{member.memberName}</Table.Cell>
      <Table.Cell>{member.memberId}</Table.Cell>
      <Table.Cell>{formatMoneySE(member.premium)}</Table.Cell>
      <Table.Cell>{formatMoneySE(member.amount)}</Table.Cell>
      <Table.Cell>
        Amount: {formatMoneySE(member.lastChargeAmount)}
        <br />
        Date: {member.lastChargeDate}
      </Table.Cell>
    </TableRow>
  ))

interface State {
  confirming: boolean
}

export class ChargePage extends React.Component<{}, State> {
  public state = { confirming: false }
  public render() {
    return (
      <Wrapper>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Member Name</Table.HeaderCell>
              <Table.HeaderCell>Member Id</Table.HeaderCell>
              <Table.HeaderCell>Member Premium</Table.HeaderCell>
              <Table.HeaderCell>Charge Amount</Table.HeaderCell>
              <Table.HeaderCell>Last Charge</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>{buildRow()}</Table.Body>
        </Table>

        <ButtonWrapper>
          <Button onClick={this.confirm}>
            {this.state.confirming ? "Yes, I'm sure" : 'Do it'}
          </Button>
          {this.state.confirming ? <div>Are you sure?</div> : null}
        </ButtonWrapper>
      </Wrapper>
    )
  }
  private confirm = () => {
    this.setState({ confirming: true })
  }
}
