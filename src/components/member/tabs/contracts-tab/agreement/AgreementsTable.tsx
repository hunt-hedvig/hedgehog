import { Agreement } from 'api/generated/graphql'
import * as React from 'react'
import styled from 'react-emotion'
import { Table } from 'semantic-ui-react'
import { getLineOfBusiness } from 'utils/agreement'
import { getEnumTitleCase } from 'utils/enum'

const StyledTableRow = styled(Table.Row)({
  cursor: 'pointer',
})

export const AgreementsTable: React.FC<{
  agreements: ReadonlyArray<Agreement>
  currentAgreement: string
  focusedAgreement: string
  setFocusedAgreement: (agreementId: string) => void
}> = ({
  agreements,
  currentAgreement,
  focusedAgreement,
  setFocusedAgreement,
}) => {
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
            <StyledTableRow
              singleLine
              key={agreement.id}
              onClick={() => setFocusedAgreement(agreement.id)}
              active={agreement.id === focusedAgreement}
              positive={agreement.id === currentAgreement}
            >
              <Table.Cell>
                {getEnumTitleCase(getLineOfBusiness(agreement))}
              </Table.Cell>
              <Table.Cell>{agreement.fromDate}</Table.Cell>
              <Table.Cell>{agreement.toDate}</Table.Cell>
              <Table.Cell>
                {agreement.premium.amount + ' ' + agreement.premium.currency}{' '}
              </Table.Cell>
              <Table.Cell>{getEnumTitleCase(agreement.status)}</Table.Cell>
            </StyledTableRow>
          )
        })}
      </Table.Body>
    </Table>
  )
}
