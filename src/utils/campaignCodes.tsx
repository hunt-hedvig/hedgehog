import {
  Agreement,
  CostDeduction,
  FreeMonths,
  Incentive,
  IndefinitePercentageDiscount,
  MonthlyPercentageDiscountFixedPeriod,
  NorwegianHomeContent,
  NorwegianTravel,
  SwedishApartment,
  SwedishHouse,
} from '../api/generated/graphql'

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

export const isIndefinitePercentageDiscount = (
  incentiveData: IncentiveDataMaybe,
): incentiveData is IndefinitePercentageDiscount =>
  incentiveData?.__typename === 'IndefinitePercentageDiscount'

// export const isSwedishApartment = (
//   agreement: Agreement,
// ): agreement is SwedishApartment => agreement.__typename === 'SwedishApartment'
//
// export const isSwedishHouse = (
//   agreement: Agreement,
// ): agreement is SwedishHouse => agreement.__typename === 'SwedishHouse'
//
// export const isNorwegianHomeContent = (
//   agreement: Agreement,
// ): agreement is NorwegianHomeContent =>
//   agreement.__typename === 'NorwegianHomeContent'
//
// export const isNorwegianTravel = (
//   agreement: Agreement,
// ): agreement is NorwegianTravel => agreement.__typename === 'NorwegianTravel'
