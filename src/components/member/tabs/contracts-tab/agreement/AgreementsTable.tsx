import { Agreement } from 'api/generated/graphql'
import * as React from 'react'
import styled from 'react-emotion'
import { Table } from 'semantic-ui-react'
import { getLineOfBusiness } from 'utils/agreement'
import { getEnumTitleCase } from 'utils/text'

const FocusableTableRow = styled(Table.Row)({
  cursor: 'pointer',
})

const FocusableTableCell = styled(Table.Cell)<{ active: boolean }>`
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
  width: 20%;
`

export const AgreementsTable: React.FC<{
  agreements: ReadonlyArray<Agreement>
  focusedAgreement: string
  setFocusedAgreement: (agreementId: string) => void
}> = ({ agreements, focusedAgreement, setFocusedAgreement }) => {
  return (
    <Table celled unstackable>
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
          const isActive = agreement.id === focusedAgreement
          return (
            <FocusableTableRow
              singleLine
              key={agreement.id}
              onClick={() => setFocusedAgreement(agreement.id)}
              active={isActive}
            >
              <FocusableTableCell active={isActive}>
                {getEnumTitleCase(getLineOfBusiness(agreement))}
              </FocusableTableCell>
              <FocusableTableCell active={isActive}>
                {agreement.fromDate}
              </FocusableTableCell>
              <FocusableTableCell active={isActive}>
                {agreement.toDate}
              </FocusableTableCell>
              <FocusableTableCell active={isActive}>
                {agreement.premium.amount + ' ' + agreement.premium.currency}{' '}
              </FocusableTableCell>
              <FocusableTableCell active={isActive}>
                {getEnumTitleCase(agreement.status)}
              </FocusableTableCell>
            </FocusableTableRow>
          )
        })}
      </Table.Body>
    </Table>
  )
}
