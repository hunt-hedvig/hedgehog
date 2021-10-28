import { lightTheme } from '@hedvig-ui'
import { Market } from 'features/config/constants'

export const totalNumberMemberGroups = 3

export const FilterState = {
  First: 0,
  Second: 1,
  Third: 2,
  HasOpenClaim: 3,
  NoOpenClaim: 4,
  ...Object.keys(Market).reduce((acc, market, index) => {
    acc[market] = 5 + index
    return acc
  }, {}),
}

export type FilterStateType = number

export const getFilterColor = (filter: FilterStateType): string => {
  switch (filter) {
    case FilterState.First:
      return lightTheme.danger
    case FilterState.Second:
      return lightTheme.success
    case FilterState.Third:
      return lightTheme.highlight
    default:
      return lightTheme.accent
  }
}
