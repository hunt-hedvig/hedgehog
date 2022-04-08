import { range } from '@hedvig-ui'
import {
  Market,
  PickedLocale,
  PickedLocaleMarket,
} from 'portals/hope/features/config/constants'
import {
  FilterState,
  FilterStateType,
} from 'portals/hope/features/questions/FilterSelect'
import { QuestionGroup } from 'types/generated/graphql'

const getGroupNumberForMember = (
  memberId: string,
  numberMemberGroups: number,
) => {
  const memberIdNumber = Number(memberId)
  return memberIdNumber % numberMemberGroups
}

export const doMemberGroupFilter =
  (numberMemberGroups: number) =>
  (selectedFilters: ReadonlyArray<FilterStateType>) =>
  (questionGroup: QuestionGroup): boolean => {
    return range(numberMemberGroups)
      .map(
        (memberGroupNumber) =>
          selectedFilters.includes(memberGroupNumber) &&
          getGroupNumberForMember(
            questionGroup.memberId,
            numberMemberGroups,
          ) === memberGroupNumber,
      )
      .includes(true)
  }

export const doMarketFilter =
  (selectedFilters: ReadonlyArray<FilterStateType>) =>
  (questionGroup: QuestionGroup): boolean => {
    const questionGroupMarket = questionGroup?.market
      ? questionGroup.market
      : questionGroup.pickedLocale
      ? PickedLocaleMarket[questionGroup.pickedLocale as PickedLocale]
      : Market.Sweden

    return Object.keys(Market).some(
      (market) =>
        selectedFilters.includes(FilterState[market]) &&
        questionGroupMarket === market.toUpperCase(),
    )
  }
