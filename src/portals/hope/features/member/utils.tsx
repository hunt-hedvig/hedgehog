import { getBirthdayInfo, getBirthDayText } from '@hedvig-ui'
import { differenceInYears, parse } from 'date-fns'
import {
  Market,
  MarketFlags,
  MemberGroupColors,
  PickedLocale,
  PickedLocaleMarket,
} from 'portals/hope/features/config/constants'
import { FilterState } from 'portals/hope/features/filters/FilterSelect'
import React from 'react'
import { ContractMarketInfo } from 'types/generated/graphql'

const getGroupNumberForMember = (
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

  return (
    <>
      {age} years
      {getBirthdayInfo(birthDateString) && (
        <> - {getBirthDayText(birthDateString)}</>
      )}
    </>
  )
}

export const getMemberIdColor = (
  memberId: string,
  numberMemberGroups: number,
) => {
  return MemberGroupColors[
    getGroupNumberForMember(memberId, numberMemberGroups) + 1
  ]
}

export const getMemberGroupName = (
  memberId: string,
  numberMemberGroups: number,
) => {
  return `${Object.keys(FilterState).find(
    (filter) =>
      FilterState[filter] ===
      getGroupNumberForMember(memberId, numberMemberGroups),
  )} group`
}

export const getMemberFlag = (
  contractMarketInfo?: {
    market: ContractMarketInfo['market']
  } | null,
  pickedLocale: PickedLocale | null = null,
): string => {
  if (contractMarketInfo?.market) {
    return MarketFlags[contractMarketInfo.market as Market]
  }

  if (!pickedLocale) {
    return '🏳'
  }

  const market = PickedLocaleMarket[pickedLocale]

  if (!market) {
    return '🏳'
  }

  return `${MarketFlags[market]} & 🏳`
}

export const formatSsn = (ssn: string) => {
  const SWEDISH_SSN_LENGTH = 12
  const NORWEGIAN_SSN_LENGTH = 11

  if (ssn.length === SWEDISH_SSN_LENGTH) {
    return ssn.slice(0, 8) + '-' + ssn.slice(8, 12)
  }

  if (ssn.length === NORWEGIAN_SSN_LENGTH) {
    return ssn.slice(0, 6) + '-' + ssn.slice(6, 11)
  }

  return ssn
}
