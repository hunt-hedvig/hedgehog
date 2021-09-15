import styled from '@emotion/styled'
import { Badge } from '@hedvig-ui'
import formatDate from 'date-fns/format'
import React from 'react'
import {
  CampaignFilter,
  CampaignOwnerPartner,
  Incentive,
  useAvailableCampaignCodeTypesQuery,
  VoucherCampaign,
} from 'types/generated/graphql'
import {
  isCostDeduction,
  isFreeMonths,
  isMonthlyPercentageDiscountFixedPeriod,
  isNoDiscount,
  isVisibleNoDiscount,
} from 'utils/campaignCodes'
import { capitalize } from 'utils/helpers'
import { formatMoney } from 'utils/money'

export const BadgeRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`

export const ValidityText = styled.span`
  font-size: 0.9em;
  display: flex;
  justify-content: center;
`

export const DateTimePickerWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`

export enum CreatableIncentiveTypes {
  MonthlyPercentageDiscountFixedPeriod = 'Monthly Percentage',
  FreeMonths = 'Free Months',
  VisibleNoDiscount = 'Visible No Discount',
}

export const initialCampaignFilter: CampaignFilter = {
  code: null,
  partnerId: null,
  activeFrom: null,
  activeTo: null,
}

export const mapCampaignOwners = (
  partnerCampaignOwners: readonly CampaignOwnerPartner[],
) =>
  partnerCampaignOwners.map(({ partnerId }) => ({
    value: partnerId,
    label: partnerId,
  }))

export const getIncentiveText = (incentive?: Incentive | null) => {
  if (incentive === undefined || incentive === null) {
    return '-'
  }

  if (isMonthlyPercentageDiscountFixedPeriod(incentive)) {
    return 'Monthly Percentage'
  }

  if (isFreeMonths(incentive)) {
    return 'Free Months'
  }

  if (isCostDeduction(incentive)) {
    return 'Cost Deduction'
  }

  if (isVisibleNoDiscount(incentive)) {
    return 'Visible No Discount'
  }

  if (isNoDiscount(incentive)) {
    return 'No Discount'
  }
}

const DiscountDetailBadge: React.FC<{ label: string }> = ({ label }) => (
  <Badge variant="success">
    <span style={{ fontWeight: 'bold' }}>{label}</span>
  </Badge>
)

const DiscountMonthBadge: React.FC<{ months?: number | null }> = ({
  months,
}) => {
  if (months === undefined || months === null) {
    return <></>
  }
  return (
    <Badge>
      <span style={{ fontWeight: 'bold' }}>
        {months} {`month${months > 1 ? 's' : ''}`}
      </span>
    </Badge>
  )
}

const ForeverBadge = () => (
  <Badge>
    <span style={{ fontWeight: 'bold' }}>Forever</span>
  </Badge>
)

export const getDiscountDetails = (incentive?: Incentive | null) => {
  if (incentive === undefined || incentive === null) {
    return '-'
  }

  if (isMonthlyPercentageDiscountFixedPeriod(incentive)) {
    return (
      <BadgeRow>
        <DiscountDetailBadge label={`${incentive.percentage}%`} />
        <DiscountMonthBadge months={incentive.numberOfMonths} />
      </BadgeRow>
    )
  }

  if (isFreeMonths(incentive)) {
    return (
      <BadgeRow>
        <DiscountDetailBadge label="Free" />
        <DiscountMonthBadge months={incentive.numberOfMonths} />
      </BadgeRow>
    )
  }

  if (isCostDeduction(incentive)) {
    return (
      <BadgeRow>
        <DiscountDetailBadge
          label={formatMoney(incentive.amount, { useGrouping: true })}
        />
        <ForeverBadge />
      </BadgeRow>
    )
  }
}

export const getValidity = (campaign: VoucherCampaign) => {
  const validFrom =
    campaign.validFrom && formatDate(new Date(campaign.validFrom), 'yyyy-MM-dd')

  const validTo =
    campaign.validTo && formatDate(new Date(campaign.validTo), 'yyyy-MM-dd')

  if (!validFrom && !validTo) {
    return <ValidityText>Always</ValidityText>
  }

  if (validFrom && !validTo) {
    return <ValidityText>{validFrom} and onwards</ValidityText>
  }

  if (!validFrom && validTo) {
    return <ValidityText>Up until {validTo}</ValidityText>
  }

  return (
    <ValidityText>
      {validFrom} - {validTo}
    </ValidityText>
  )
}

export const getCodeTypeOptions = () => {
  const codeTypesQuery = useAvailableCampaignCodeTypesQuery()
  const codeTypes = codeTypesQuery.data?.availableCampaignCodeTypes ?? []
  return (
    codeTypes.map((value, index) => {
      return {
        key: index + 1,
        value,
        label: (value as string)
          .split('_')
          .map(capitalize)
          .join(' '),
      }
    }) ?? []
  )
}
