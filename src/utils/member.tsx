import { ContractMarketInfo } from 'api/generated/graphql'
import { FilterState, getFilterColor } from 'components/questions/filter'
import { differenceInYears, parse } from 'date-fns'
import React from 'react'
import { Market } from 'types/enums'

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
  numberTeamColors: number = 2,
) => {
  return getFilterColor(+memberId % numberTeamColors)
}

export const getMemberGroup = (
  memberId: string,
  numberTeamColors: number = 2,
) => {
  return `${FilterState[+memberId % numberTeamColors]} team`
}

export const getMemberFlag = (
  contractMarketInfo?: ContractMarketInfo | null,
): string => {
  if (!contractMarketInfo) {
    return '🏳'
  }

  switch (contractMarketInfo.market) {
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
