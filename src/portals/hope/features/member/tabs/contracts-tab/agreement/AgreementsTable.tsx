import { css } from '@emotion/react'
import styled from '@emotion/styled'
import {
  Table,
  TableBody,
  TableColumn,
  TableHeader,
  TableHeaderColumn,
  TableRow,
} from '@hedvig-ui'
import { formatMoney } from '@hedvig-ui'
import { convertEnumToTitle } from '@hedvig-ui'
import React from 'react'
import { AgreementStatus, GenericAgreement } from 'types/generated/graphql'
import { getCarrierText } from 'portals/hope/features/member/tabs/contracts-tab/utils'
import { InsuranceStatusBadge } from 'portals/hope/features/member/tabs/contracts-tab/agreement/InsuranceStatusBadge'

const SelectableTableCell = styled(TableColumn)<{
  selected: boolean
  status: AgreementStatus
}>`
  font-size: 1.2rem;
  ${({ selected, theme }) =>
    selected &&
    css`
      background: ${theme.accent} !important;
      color: ${theme.accentContrast} !important;
    `};
  width: 20%;
`

export const AgreementsTable: React.FC<{
  agreements: ReadonlyArray<GenericAgreement>
  selectedAgreement: string | undefined
  setSelectedAgreement: (agreementId: string | undefined) => void
}> = ({ agreements, selectedAgreement, setSelectedAgreement }) => {
  return (
    <Table style={{ margin: '1em 0' }}>
      <TableHeader>
        <TableHeaderColumn>Line of Business</TableHeaderColumn>
        <TableHeaderColumn>Carrier</TableHeaderColumn>
        <TableHeaderColumn>From Date</TableHeaderColumn>
        <TableHeaderColumn>To Date</TableHeaderColumn>
        <TableHeaderColumn>Premium</TableHeaderColumn>
        <TableHeaderColumn>Status</TableHeaderColumn>
      </TableHeader>
      <TableBody>
        {agreements.map((agreement) => {
          const isSelected = agreement.id === selectedAgreement
          return (
            <TableRow
              key={agreement.id}
              onClick={() =>
                selectedAgreement === agreement.id
                  ? setSelectedAgreement(undefined)
                  : setSelectedAgreement(agreement.id)
              }
              active={isSelected}
              border
            >
              <SelectableTableCell
                selected={isSelected}
                status={agreement.status}
              >
                {convertEnumToTitle(agreement.lineOfBusinessName)}
              </SelectableTableCell>
              <SelectableTableCell
                selected={isSelected}
                status={agreement.status}
              >
                {getCarrierText(agreement.carrier)}
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
                {formatMoney(agreement.premium, { minimumFractionDigits: 0 })}
              </SelectableTableCell>
              <SelectableTableCell
                selected={isSelected}
                status={agreement.status}
              >
                <InsuranceStatusBadge status={agreement.status}>
                  {convertEnumToTitle(agreement.status)}
                </InsuranceStatusBadge>
              </SelectableTableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
