import { range } from '@hedvig-ui/utils/range'
import { Market } from 'features/config/constants'
import { getMarketFromPickedLocale } from 'features/member/utils'
import { FilterState, FilterStateType } from 'features/questions/filter'
import { Claim, ClaimState, QuestionGroup } from 'types/generated/graphql'

const getGroupNumberForMember = (
  memberId: string,
  numberMemberGroups: number,
) => {
  const memberIdNumber = Number(memberId)
  return memberIdNumber % numberMemberGroups
}

export const hasOpenClaim = (claims: ReadonlyArray<Claim>): boolean => {
  return claims.some(
    (claim) =>
      claim.state === ClaimState.Open || claim.state === ClaimState.Reopened,
  )
}

export const doMemberGroupFilter = (numberMemberGroups: number) => (
  selectedFilters: ReadonlyArray<FilterStateType>,
) => (questionGroup: QuestionGroup): boolean => {
  return range(numberMemberGroups)
    .map(
      (memberGroupNumber) =>
        selectedFilters.includes(memberGroupNumber) &&
        getGroupNumberForMember(questionGroup.memberId, numberMemberGroups) ===
          memberGroupNumber,
    )
    .includes(true)
}

export const doMarketFilter = (
  selectedFilters: ReadonlyArray<FilterStateType>,
) => (questionGroup: QuestionGroup): boolean => {
  const questionGroupMarket = questionGroup?.member?.contractMarketInfo?.market
    ? questionGroup.member.contractMarketInfo.market
    : questionGroup.member?.pickedLocale
    ? getMarketFromPickedLocale(questionGroup.member.pickedLocale)
    : Market.Sweden

  return Object.keys(Market).some(
    (market) =>
      selectedFilters.includes(FilterState[market]) &&
      questionGroupMarket === market.toUpperCase(),
  )
}

export const doClaimFilter = (
  selectedFilters: ReadonlyArray<FilterStateType>,
) => (questionGroup: QuestionGroup): boolean => {
  if (!questionGroup.member) {
    return true
  }
  return (
    (selectedFilters.includes(FilterState.HasOpenClaim) &&
      hasOpenClaim(questionGroup.member.claims)) ||
    (selectedFilters.includes(FilterState.NoOpenClaim) &&
      !hasOpenClaim(questionGroup.member.claims))
  )
}
