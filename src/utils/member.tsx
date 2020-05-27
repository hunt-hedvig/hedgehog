import { colorsV3 } from '@hedviginsurance/brand'
import { Market } from 'api/generated/graphql'
import { differenceInYears, parse } from 'date-fns'
import React from 'react'

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

export const isMemberIdEven = (memberId: string) => {
  let isMemberIdEvenReally = false
  try {
    isMemberIdEvenReally = parseInt(memberId, 10) % 2 === 0
  } catch (_) {
    // noop
  }
  return isMemberIdEvenReally
}

const tomasMemberId = 185188729
export const getMemberIdColor = (memberId: string) => {
  if (parseInt(memberId, 10) === tomasMemberId) {
    return '#000'
  }

  if (isMemberIdEven(memberId)) {
    return colorsV3.orange
  }
  return colorsV3.pistachio700
}

export const getMemberGroup = (memberId: number) => {
  if (memberId === tomasMemberId) {
    return 'The dark lord Sith'
  }

  if (isMemberIdEven(memberId.toString())) {
    return 'The Empire'
  }
  return 'The Resistance'
}

export const getMemberFlag = (market: Market): string => {
  switch (market) {
    case Market.Norway:
      return '🇳🇴'
    case Market.Sweden:
      return '🇸🇪'
    default:
      return '🏳'
  }
}
