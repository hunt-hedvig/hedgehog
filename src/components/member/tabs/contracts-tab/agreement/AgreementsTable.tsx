import { Agreement } from 'api/generated/graphql'
import * as React from 'react'
import styled from 'react-emotion'
import { Table } from 'semantic-ui-react'
import { getLineOfBusiness } from 'utils/agreement'
import { getEnumTitleCase } from 'utils/text'

const SelectableTableRow = styled(Table.Row)({
  cursor: 'pointer',
})

const SelectableTableCell = styled(Table.Cell)<{ selected: boolean }>`
  font-weight: ${({ selected }) => (selected ? 'bold' : 'normal')};
  width: 20%;
`

export const AgreementsTable: React.FC<{
  agreements: ReadonlyArray<Agreement>
  selectedAgreement: string
  setSelectedAgreement: (agreementId: string) => void
}> = ({ agreements, selectedAgreement, setSelectedAgreement }) => {
  return (
    <Table celled unstackable>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Line of Business</Table.HeaderCell>
          <Table.HeaderCell>From Date</Table.HeaderCell>
          <Table.HeaderCell>To Date</Table.HeaderCell>
          <Table.HeaderCell>Premium</Table.HeaderCell>
          <Table.HeaderCell>Status</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {agreements.map((agreement) => {
          const isSelected = agreement.id === selectedAgreement
          return (
            <SelectableTableRow
              singleLine
              key={agreement.id}
              onClick={() => setSelectedAgreement(agreement.id)}
              active={isSelected}
            >
              <SelectableTableCell selected={isSelected}>
                {getEnumTitleCase(getLineOfBusiness(agreement))}
              </SelectableTableCell>
              <SelectableTableCell selected={isSelected}>
                {agreement.fromDate}
              </SelectableTableCell>
              <SelectableTableCell selected={isSelected}>
                {agreement.toDate}
              </SelectableTableCell>
              <SelectableTableCell selected={isSelected}>
                {agreement.premium.amount + ' ' + agreement.premium.currency}{' '}
              </SelectableTableCell>
              <SelectableTableCell selected={isSelected}>
                {getEnumTitleCase(agreement.status)}
              </SelectableTableCell>
            </SelectableTableRow>
          )
        })}
      </Table.Body>
    </Table>
  )
}
