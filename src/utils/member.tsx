import { colorsV2 } from '@hedviginsurance/brand'
import { Market } from 'api/generated/graphql'
import { differenceInYears, parse } from 'date-fns'
import React from 'react'
import styled from 'react-emotion'
import { Gender } from 'store/storeTypes'

const OLD_MAN = '👴🏼'
const MIDDLE_AGED_MAN = '👱🏼‍♂️'
const YOUNG_MAN = '🧑🏽'
const REALLY_YOUNG_MAN = '🧒🏻'
const BABY = '👶🏻'

const OLD_WOMAN = '👵🏾'
const MIDDLE_AGED_WOMAN = '👱🏼‍♀️️'
const YOUNG_WOMAN = '👩🏾'
const REALLY_YOUNG_WOMAN = '👧🏼'

const EmojiWrapper = styled('span')({
  fontSize: '1.5em',
  verticalAlign: 'text-bottom',
})

export const MemberEmoji: React.FC<{
  birthDateString: string
  gender: Gender
}> = ({ birthDateString, gender }) => {
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
      &nbsp; ({age} years) &nbsp;
      <EmojiWrapper>
        {(() => {
          if (gender === 'MALE') {
            switch (true) {
              case age < 20:
                return BABY
              case age < 25:
                return REALLY_YOUNG_MAN
              case age < 30:
                return YOUNG_MAN
              case age < 50:
                return MIDDLE_AGED_MAN
              default:
                return OLD_MAN
            }
          }

          if (gender === 'FEMALE') {
            switch (true) {
              case age < 20:
                return BABY
              case age < 25:
                return REALLY_YOUNG_WOMAN
              case age < 30:
                return YOUNG_WOMAN
              case age < 50:
                return MIDDLE_AGED_WOMAN
              default:
                return OLD_WOMAN
            }
          }

          return '🐺'
        })()}
      </EmojiWrapper>
      &nbsp;
    </>
  )
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
    return colorsV2.coral500
  }
  return colorsV2.grass300
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
