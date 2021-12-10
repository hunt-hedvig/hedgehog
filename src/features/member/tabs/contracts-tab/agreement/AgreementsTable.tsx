import { css } from '@emotion/react'
import styled from '@emotion/styled'
import {
  Table as DefaultTable,
  TableBody,
  TableColumn,
  TableHeader,
  TableHeaderColumn,
  TableRow,
} from '@hedvig-ui'
import { formatMoney } from '@hedvig-ui/utils/money'
import { convertEnumToTitle } from '@hedvig-ui/utils/text'
import chroma from 'chroma-js'
import { InsuranceStatusBadge } from 'features/member/tabs/contracts-tab/agreement/InsuranceStatusBadge'
import { getCarrierText } from 'features/member/tabs/contracts-tab/utils'
import React, { useState } from 'react'
import { AgreementStatus, GenericAgreement } from 'types/generated/graphql'

const Table = styled(DefaultTable)<{ focused: boolean }>`
  margin: 1em 0;
  border: ${({ focused, theme }) =>
    focused ? `1px solid ${theme.accent}` : 'none'};
`

const SelectableTableCell = styled(TableColumn)<{
  selected: boolean
  status: AgreementStatus
  focused: boolean
}>`
  font-size: 1.2rem;
  ${({ selected, theme, focused }) =>
    selected &&
    css`
      background: ${!focused
        ? theme.accent
        : chroma(theme.accent)
            .alpha(0.1)
            .hex()} !important;
      color: ${theme.accentContrast} !important;
    `};
  width: 20%;
`

export const AgreementsTable: React.FC<{
  agreements: ReadonlyArray<GenericAgreement>
  selectedAgreement: string | undefined
  setSelectedAgreement: (agreementId: string | undefined) => void
  navigationAvailable: boolean
}> = ({
  agreements,
  selectedAgreement,
  setSelectedAgreement,
  navigationAvailable,
}) => {
  const [activeRow, setActiveRow] = useState<number | null>(null)

  return (
    <Table focused={navigationAvailable}>
      <TableHeader>
        <TableHeaderColumn>Line of Business</TableHeaderColumn>
        <TableHeaderColumn>Carrier</TableHeaderColumn>
        <TableHeaderColumn>From Date</TableHeaderColumn>
        <TableHeaderColumn>To Date</TableHeaderColumn>
        <TableHeaderColumn>Premium</TableHeaderColumn>
        <TableHeaderColumn>Status</TableHeaderColumn>
      </TableHeader>
      <TableBody
        isActive={navigationAvailable}
        setActiveRow={(num) => setActiveRow(num)}
        onPerformNavigation={(index) => {
          if (selectedAgreement === agreements[index].id) {
            setSelectedAgreement(undefined)
            return
          }
          setSelectedAgreement(agreements[index].id)
        }}
      >
        {agreements.map((agreement, index) => {
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
                focused={activeRow === index}
                status={agreement.status}
              >
                {convertEnumToTitle(agreement.lineOfBusinessName)}
              </SelectableTableCell>
              <SelectableTableCell
                selected={isSelected}
                focused={activeRow === index}
                status={agreement.status}
              >
                {getCarrierText(agreement.carrier)}
              </SelectableTableCell>
              <SelectableTableCell
                selected={isSelected}
                focused={activeRow === index}
                status={agreement.status}
              >
                {agreement.fromDate}
              </SelectableTableCell>
              <SelectableTableCell
                selected={isSelected}
                focused={activeRow === index}
                status={agreement.status}
              >
                {agreement.toDate}
              </SelectableTableCell>
              <SelectableTableCell
                selected={isSelected}
                focused={activeRow === index}
                status={agreement.status}
              >
                {formatMoney(agreement.premium, { minimumFractionDigits: 0 })}
              </SelectableTableCell>
              <SelectableTableCell
                selected={isSelected}
                focused={activeRow === index}
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
