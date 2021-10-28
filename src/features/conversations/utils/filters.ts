import { range } from '@hedvig-ui/utils/range'
import { Market } from 'features/config/constants'
import { getMarketFromPickedLocale } from 'features/member/utils'
import { FilterState } from 'features/questions/filter'
import { ClaimState, QuestionGroup } from 'types/generated/graphql'

const getGroupNumberForMember = (
  memberId: string,
  numberMemberGroups: number,
) => {
  const memberIdNumber = Number(memberId)
  return memberIdNumber % numberMemberGroups
}

export const doMemberGroupFilter = (numberMemberGroups: number) => (
  selectedFilters: ReadonlyArray<FilterState>,
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

export const doMarketFilter = (selectedFilters: ReadonlyArray<FilterState>) => (
  questionGroup: QuestionGroup,
): boolean => {
  const questionGroupMarket = questionGroup?.member?.contractMarketInfo?.market
    ? questionGroup.member.contractMarketInfo.market
    : questionGroup.member?.pickedLocale
    ? getMarketFromPickedLocale(questionGroup.member.pickedLocale)
    : Market.Sweden
  if (
    selectedFilters.includes(FilterState.Sweden) &&
    questionGroupMarket === Market.Sweden
  ) {
    return true
  }
  if (
    selectedFilters.includes(FilterState.Norway) &&
    questionGroupMarket === Market.Norway
  ) {
    return true
  }
  if (
    selectedFilters.includes(FilterState.Denmark) &&
    questionGroupMarket === Market.Denmark
  ) {
    return true
  }
  return false
}

export const doClaimFilter = (selectedFilters: ReadonlyArray<FilterState>) => (
  questionGroup: QuestionGroup,
): boolean => {
  if (!questionGroup.member) {
    return true
  }
  return (
    (selectedFilters.includes(FilterState.HasOpenClaim) &&
      questionGroup.member.claims.some(
        (claim) =>
          claim.state === ClaimState.Open ||
          claim.state === ClaimState.Reopened,
      )) ||
    (selectedFilters.includes(FilterState.NoOpenClaim) &&
      !questionGroup.member.claims.some(
        (claim) =>
          claim.state === ClaimState.Open ||
          claim.state === ClaimState.Reopened,
      ))
  )
}
