import { ContractMarketInfo } from 'api/generated/graphql'
import { FilterState, getFilterColor } from 'components/questions/filter'
import { differenceInYears, parse } from 'date-fns'
import React from 'react'
import { Market, PickedLocale } from 'types/enums'

export const getGroupNumberForMember = (
  memberId: string,
  numberMemberGroups: number,
) => {
  const memberIdNumber = Number(memberId)
  return memberIdNumber % numberMemberGroups
}

export const MemberAge: React.FC<{
  birthDateString: string
}> = ({ birthDateString }) => {
  if (!birthDateString) {
    return null
  }
  let birthDate
  try {
    birthDate = parse(birthDateString, 'yyyy-MM-dd', new Date())
  } catch (e) {
    return null
  }
  const age = differenceInYears(new Date(), birthDate)

  return <>{age} years</>
}

export const getMemberIdColor = (
  memberId: string,
  numberMemberGroups: number,
) => {
  return getFilterColor(getGroupNumberForMember(memberId, numberMemberGroups))
}

export const getMemberGroupName = (
  memberId: string,
  numberMemberGroups: number,
) => {
  return `${
    FilterState[getGroupNumberForMember(memberId, numberMemberGroups)]
  } group`
}

export const getMemberFlag = (
  contractMarketInfo?: {
    market: ContractMarketInfo['market']
  } | null,
  pickedLocale: string | null = null,
): string => {
  if (contractMarketInfo?.market) {
    return getMemberFlagFromMarket(contractMarketInfo.market as Market)
  }

  if (!pickedLocale) {
    return '🏳'
  }
  const market = getMarketFromPickedLocale(pickedLocale)
  if (!market) {
    return '🏳'
  }

  return `${getMemberFlagFromMarket(market)} & 🏳`
}

export const getMarketFromPickedLocale = (
  pickedLocale: string,
): Market | null => {
  switch (pickedLocale) {
    case PickedLocale.NbNo:
    case PickedLocale.EnNo:
      return Market.Norway
    case PickedLocale.SvSe:
    case PickedLocale.EnSe:
      return Market.Sweden
    case PickedLocale.DaDk:
    case PickedLocale.EnDk:
      return Market.Denmark
    default:
      return null
  }
}

const getMemberFlagFromMarket = (market: Market): string => {
  switch (market) {
    case Market.Norway:
      return '🇳🇴'
    case Market.Sweden:
      return '🇸🇪'
    case Market.Denmark:
      return '🇩🇰'
    default:
      return '🏳'
  }
}

const SWEDISH_SSN_LENGTH = 12
const NORWEGIAN_SSN_LENGTH = 11
export const formatSsn = (ssn: string) => {
  if (ssn.length === SWEDISH_SSN_LENGTH) {
    return ssn.slice(0, 8) + '-' + ssn.slice(8, 12)
  }

  if (ssn.length === NORWEGIAN_SSN_LENGTH) {
    return ssn.slice(0, 6) + '-' + ssn.slice(6, 11)
  }

  return ssn
}
