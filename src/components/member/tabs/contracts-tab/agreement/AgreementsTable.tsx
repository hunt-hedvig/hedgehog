import { colorsV2 } from '@hedviginsurance/brand/dist/colors'
import { Agreement, AgreementStatus } from 'api/generated/graphql'
import React from 'react'
import styled from 'react-emotion'
import { Table } from 'semantic-ui-react'
import { getLineOfBusiness } from 'utils/agreement'
import { getEnumTitleCase } from 'utils/text'

const SelectableTableRow = styled(Table.Row)({
  cursor: 'pointer',
})

const SelectableTableCell = styled(Table.Cell)<{
  selected: boolean
  status: AgreementStatus
}>`
  font-weight: ${({ selected }) => (selected ? 'bold' : 'normal')};
  font-size: 1.2rem;
  color: ${({ status }) => {
    if (status === AgreementStatus.Terminated) {
      return colorsV2.coral700
    }
    if (status === AgreementStatus.Active) {
      return colorsV2.ocean700
    }
    if (status === AgreementStatus.Pending) {
      return colorsV2.violet700
    }
    return colorsV2.black
  }};
  width: 20%;
`

export const AgreementsTable: React.FC<{
  agreements: ReadonlyArray<Agreement>
  selectedAgreement: string | undefined
  setSelectedAgreement: (agreementId: string | undefined) => void
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
              onClick={() =>
                selectedAgreement === agreement.id
                  ? setSelectedAgreement(undefined)
                  : setSelectedAgreement(agreement.id)
              }
              active={isSelected}
            >
              <SelectableTableCell
                selected={isSelected}
                status={agreement.status}
              >
                {getEnumTitleCase(getLineOfBusiness(agreement))}
              </SelectableTableCell>
              <SelectableTableCell
                selected={isSelected}
                status={agreement.status}
              >
                {agreement.fromDate}
              </SelectableTableCell>
              <SelectableTableCell
                selected={isSelected}
                status={agreement.status}
              >
                {agreement.toDate}
              </SelectableTableCell>
              <SelectableTableCell
                selected={isSelected}
                status={agreement.status}
              >
                {agreement.premium.amount + ' ' + agreement.premium.currency}{' '}
              </SelectableTableCell>
              <SelectableTableCell
                selected={isSelected}
                status={agreement.status}
              >
                {getEnumTitleCase(agreement.status)}
              </SelectableTableCell>
            </SelectableTableRow>
          )
        })}
      </Table.Body>
    </Table>
  )
}
