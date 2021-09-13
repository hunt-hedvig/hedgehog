import {
  CostDeduction,
  FreeMonths,
  Incentive,
  MonthlyPercentageDiscountFixedPeriod,
  NoDiscount,
  VisibleNoDiscount,
} from '/types/generated/graphql'

type IncentiveDataMaybe = Incentive | null | undefined

export const isMonthlyPercentageDiscountFixedPeriod = (
  incentiveData: IncentiveDataMaybe,
): incentiveData is MonthlyPercentageDiscountFixedPeriod =>
  incentiveData?.__typename === 'MonthlyPercentageDiscountFixedPeriod'

export const isFreeMonths = (
  incentiveData: IncentiveDataMaybe,
): incentiveData is FreeMonths => incentiveData?.__typename === 'FreeMonths'

export const isCostDeduction = (
  incentiveData: IncentiveDataMaybe,
): incentiveData is CostDeduction =>
  incentiveData?.__typename === 'CostDeduction'

export const isVisibleNoDiscount = (
  incentiveData: IncentiveDataMaybe,
): incentiveData is VisibleNoDiscount =>
  incentiveData?.__typename === 'VisibleNoDiscount'

export const isNoDiscount = (
  incentiveData: IncentiveDataMaybe,
): incentiveData is NoDiscount => incentiveData?.__typename === 'NoDiscount'

const generateRange = (min: number, max: number, step: number): number[] => {
  return new Array(max).fill(0).map((_, index) => min + index * step)
}

export const numberOfMonthsOptions = generateRange(1, 12, 1).map(
  (noOfMonths) => ({
    label: noOfMonths,
    value: noOfMonths,
    text: noOfMonths,
  }),
)

export const percentageDiscountOptions = generateRange(5, 20, 5).map(
  (percentage) => ({
    label: percentage + '%',
    value: percentage,
    text: percentage + '%',
  }),
)
