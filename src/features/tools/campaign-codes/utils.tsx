import {
  AssignVoucherPercentageDiscount,
  CampaignFilter,
  CampaignOwnerPartner,
  Incentive,
  VoucherCampaign,
} from 'api/generated/graphql'
import formatDate from 'date-fns/format'
import { Badge, BadgeRow } from 'features/tools/campaign-codes/styles'
import React from 'react'
import styled from 'react-emotion'
import {
  isCostDeduction,
  isFreeMonths,
  isMonthlyPercentageDiscountFixedPeriod,
  isNoDiscount,
  isVisibleNoDiscount,
} from 'utils/campaignCodes'
import { formatMoney } from 'utils/money'

export enum CreateableIncentiveTypes {
  MonthlyPercentageDiscountFixedPeriod = 'Monthly Percentage',
}

export interface PartnerIdOptions {
  key: string
  value: string
  text: string
}

export const formLooksGood = (formData: AssignVoucherPercentageDiscount) => {
  return formData.partnerId !== '' && formData.code !== ''
}

export const initialCampaignFilter: CampaignFilter = {
  code: null,
  partnerId: null,
  activeFrom: null,
  activeTo: null,
}

export const mapCampaignOwners = (
  partnerCampaignOwners: readonly CampaignOwnerPartner[],
): PartnerIdOptions[] =>
  partnerCampaignOwners.map(({ partnerId }) => ({
    key: partnerId,
    value: partnerId,
    text: partnerId,
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
  <Badge variant="success" width={'40%'}>
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
    <Badge width={'45%'}>
      <span style={{ fontWeight: 'bold' }}>
        {months} {`month${months > 1 ? 's' : ''}`}
      </span>
    </Badge>
  )
}

const ForeverBadge = () => (
  <Badge width={'45%'}>
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
        <DiscountDetailBadge label={'Free'} />
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

const ValidityText = styled.span`
  font-size: 0.9em;
  display: flex;
  justify-content: center;
`

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
      {validFrom}
      {'  '}-{'  '}
      {validTo}
    </ValidityText>
  )
}
