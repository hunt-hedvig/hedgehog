import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { TableColumn, TableRow } from '@hedvig-ui'
import { formatMoney } from '@hedvig-ui/utils/money'
import { convertEnumToTitle } from '@hedvig-ui/utils/text'
import React from 'react'
import {
  AgreementStatus,
  GenericAgreement,
  useGetTermsAndConditionsQuery,
} from 'types/generated/graphql'
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

interface AgreementRowProps {
  selected: boolean
  selectedAgreement: string | undefined
  setSelectedAgreement: (agreementId: string | undefined) => void
  agreement: GenericAgreement
  locale: string
}

export const AgreementRow: React.FC<AgreementRowProps> = ({
  selected,
  agreement: {
    id,
    typeOfContract,
    partner,
    carrier,
    status,
    lineOfBusinessName,
    fromDate,
    toDate,
    premium,
    createdAt,
  },
  selectedAgreement,
  setSelectedAgreement,
  locale,
}) => {
  const { data } = useGetTermsAndConditionsQuery({
    variables: {
      contractType: typeOfContract,
      partner,
      carrier,
      date: createdAt,
      locale,
    },
  })

  console.log(data)

  return (
    <TableRow
      key={id}
      onClick={() =>
        selectedAgreement === id
          ? setSelectedAgreement(undefined)
          : setSelectedAgreement(id)
      }
      active={selected}
      border
    >
      <SelectableTableCell selected={selected} status={status}>
        {convertEnumToTitle(lineOfBusinessName)}
      </SelectableTableCell>
      <SelectableTableCell selected={selected} status={status}>
        {getCarrierText(carrier)}
      </SelectableTableCell>
      <SelectableTableCell selected={selected} status={status}>
        {fromDate}
      </SelectableTableCell>
      <SelectableTableCell selected={selected} status={status}>
        {toDate}
      </SelectableTableCell>
      <SelectableTableCell selected={selected} status={status}>
        {formatMoney(premium, { minimumFractionDigits: 0 })}
      </SelectableTableCell>
      <SelectableTableCell selected={selected} status={status}>
        <InsuranceStatusBadge status={status}>
          {convertEnumToTitle(status)}
        </InsuranceStatusBadge>
      </SelectableTableCell>
    </TableRow>
  )
}
