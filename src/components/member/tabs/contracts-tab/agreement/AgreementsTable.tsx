import { Agreement } from 'api/generated/graphql'
import * as React from 'react'
import styled from 'react-emotion'
import { Table } from 'semantic-ui-react'
import { getLineOfBusiness } from 'utils/agreement'

const ClickableRow = styled(Table.Row)({
  cursor: 'pointer',
})

export const AgreementsTable: React.FC<{
  agreements: ReadonlyArray<Agreement>
  focusedAgreement: string
  setFocusedAgreement: (agreementId: string) => void
}> = ({ agreements, focusedAgreement, setFocusedAgreement }) => {
  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Type</Table.HeaderCell>
          <Table.HeaderCell>Active from</Table.HeaderCell>
          <Table.HeaderCell>Active to</Table.HeaderCell>
          <Table.HeaderCell>Premium</Table.HeaderCell>
          <Table.HeaderCell>Status</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {agreements.map((agreement) => {
          return (
            <ClickableRow
              key={agreement.id}
              onClick={() => setFocusedAgreement(agreement.id)}
              active={agreement.id === focusedAgreement}
            >
              <Table.Cell>{getLineOfBusiness(agreement)}</Table.Cell>
              <Table.Cell>{agreement.fromDate}</Table.Cell>
              <Table.Cell>{agreement.toDate}</Table.Cell>
              <Table.Cell>
                {agreement.premium.amount + ' ' + agreement.premium.currency}{' '}
              </Table.Cell>
              <Table.Cell>{agreement.status}</Table.Cell>
            </ClickableRow>
          )
        })}
      </Table.Body>
    </Table>
  )
}
