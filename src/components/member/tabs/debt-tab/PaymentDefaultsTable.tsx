import { PaymentDefault } from 'api/generated/graphql'
import React from 'react'
import { Table } from 'semantic-ui-react'
import { formatMoney } from 'utils/money'

const sortPaymentDefaultByYear = (a, b) => {
  const aDate = new Date(a.year)
  const bDate = new Date(b.year)
  return ((bDate as any) as number) - ((aDate as any) as number)
}

export const PaymentDefaultsTable: React.FC<{
  paymentDefaults: PaymentDefault[]
}> = ({ paymentDefaults }) => {
  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Year</Table.HeaderCell>
          <Table.HeaderCell>Payment Default Type</Table.HeaderCell>
          <Table.HeaderCell>Debt Amount</Table.HeaderCell>
          <Table.HeaderCell>Claimant</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {[...paymentDefaults]
          .sort(sortPaymentDefaultByYear)
          .map((paymentDefault, index) => (
            <Table.Row key={paymentDefault.caseId ?? index}>
              <Table.Cell>{paymentDefault.year}</Table.Cell>
              <Table.Cell>{paymentDefault.paymentDefaultTypeText}</Table.Cell>
              <Table.Cell>
                {formatMoney(paymentDefault.amount, { useGrouping: true })}
              </Table.Cell>
              <Table.Cell>{paymentDefault.claimant}</Table.Cell>
            </Table.Row>
          ))}
      </Table.Body>
    </Table>
  )
}
