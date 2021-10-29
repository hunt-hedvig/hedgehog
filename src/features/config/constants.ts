import { lightTheme } from '@hedvig-ui'

export enum Market {
  Sweden = 'SWEDEN',
  Norway = 'NORWAY',
  Denmark = 'DENMARK',
}

export const MarketFlags: Record<Market, string> = {
  NORWAY: '🇳🇴',
  DENMARK: '🇩🇰',
  SWEDEN: '🇸🇪',
}

export enum PickedLocale {
  SvSe = 'sv_SE',
  EnSe = 'en_SE',
  NbNo = 'nb_NO',
  EnNo = 'en_NO',
  DaDk = 'da_DK',
  EnDk = 'en_DK',
}

export const PickedLocaleFlag: Record<PickedLocale, string> = {
  [PickedLocale.EnNo]: '🇬🇧',
  [PickedLocale.EnSe]: '🇬🇧',
  [PickedLocale.EnDk]: '🇬🇧',
  [PickedLocale.DaDk]: '🇩🇰',
  [PickedLocale.SvSe]: '🇸🇪',
  [PickedLocale.NbNo]: '🇳🇴',
}

export const PickedLocaleMarket: Record<PickedLocale, Market> = {
  [PickedLocale.EnNo]: Market.Norway,
  [PickedLocale.NbNo]: Market.Norway,
  [PickedLocale.EnDk]: Market.Denmark,
  [PickedLocale.DaDk]: Market.Denmark,
  [PickedLocale.EnSe]: Market.Sweden,
  [PickedLocale.SvSe]: Market.Sweden,
}

export const MemberGroups: Record<string, number> = {
  First: 1,
  Second: 2,
  Third: 3,
}

export const MemberGroupColors: Record<string, string> = {
  [MemberGroups.First]: lightTheme.danger,
  [MemberGroups.Second]: lightTheme.success,
  [MemberGroups.Third]: lightTheme.highlight,
}

export enum ContractType {
  SwedishApartment = 'SWEDISH_APARTMENT',
  SwedishHouse = 'SWEDISH_HOUSE',
  SwedishAccident = 'SWEDISH_ACCIDENT',
  NorwegianHomeContent = 'NORWEGIAN_HOME_CONTENT',
  NorwegianTravel = 'NORWEGIAN_TRAVEL',
  DanishHomeContent = 'DANISH_HOME_CONTENT',
  DanishTravel = 'DANISH_TRAVEL',
  DanishAccident = 'DANISH_ACCIDENT',
}

export enum QuoteProductType {
  Apartment = 'APARTMENT',
  House = 'HOUSE',
  Object = 'OBJECT',
  HomeContent = 'HOME_CONTENT',
  Travel = 'TRAVEL',
  Accident = 'ACCIDENT',
}

export const QuoteProductTypeContractMap: Record<
  QuoteProductType,
  ContractType[]
> = {
  [QuoteProductType.HomeContent]: [
    ContractType.NorwegianHomeContent,
    ContractType.DanishHomeContent,
  ],
  [QuoteProductType.Apartment]: [ContractType.SwedishApartment],
  [QuoteProductType.Accident]: [
    ContractType.DanishAccident,
    ContractType.SwedishAccident,
  ],
  [QuoteProductType.House]: [ContractType.SwedishHouse],
  [QuoteProductType.Object]: [],
  [QuoteProductType.Travel]: [
    ContractType.NorwegianTravel,
    ContractType.DanishTravel,
  ],
}

export const ContractMarketTypes: Record<Market, ContractType[]> = {
  SWEDEN: [
    ContractType.SwedishHouse,
    ContractType.SwedishApartment,
    ContractType.SwedishAccident,
  ],
  NORWAY: [ContractType.NorwegianHomeContent, ContractType.NorwegianTravel],
  DENMARK: [
    ContractType.DanishHomeContent,
    ContractType.DanishTravel,
    ContractType.DanishAccident,
  ],
}

export enum TypeOfContract {
  SeHouse = 'SE_HOUSE',
  SeApartmentBrf = 'SE_APARTMENT_BRF',
  SeApartmentRent = 'SE_APARTMENT_RENT',
  SeApartmentStudentBrf = 'SE_APARTMENT_STUDENT_BRF',
  SeApartmentStudentRent = 'SE_APARTMENT_STUDENT_RENT',
  SeAccident = 'SE_ACCIDENT',
  SeAccidentStudent = 'SE_ACCIDENT_STUDENT',
  NoHomeContentOwn = 'NO_HOME_CONTENT_OWN',
  NoHomeContentRent = 'NO_HOME_CONTENT_RENT',
  NoHomeContentYouthOwn = 'NO_HOME_CONTENT_YOUTH_OWN',
  NoHomeContentYouthRent = 'NO_HOME_CONTENT_YOUTH_RENT',
  NoTravel = 'NO_TRAVEL',
  NoTravelYouth = 'NO_TRAVEL_YOUTH',
  DkHomeContentOwn = 'DK_HOME_CONTENT_OWN',
  DkHomeContentRent = 'DK_HOME_CONTENT_RENT',
  DkHomeContentStudentOwn = 'DK_HOME_CONTENT_STUDENT_OWN',
  DkHomeContentStudentRent = 'DK_HOME_CONTENT_STUDENT_RENT',
  DkAccident = 'DK_ACCIDENT',
  DkAccidentStudent = 'DK_ACCIDENT_STUDENT',
  DkTravel = 'DK_TRAVEL',
  DkTravelStudent = 'DK_TRAVEL_STUDENT',
}

export const TypeOfContractType: Record<TypeOfContract, ContractType> = {
  [TypeOfContract.SeHouse]: ContractType.SwedishHouse,
  [TypeOfContract.SeApartmentBrf]: ContractType.SwedishApartment,
  [TypeOfContract.SeApartmentRent]: ContractType.SwedishApartment,
  [TypeOfContract.SeApartmentStudentBrf]: ContractType.SwedishApartment,
  [TypeOfContract.SeApartmentStudentRent]: ContractType.SwedishApartment,
  [TypeOfContract.SeAccident]: ContractType.SwedishAccident,
  [TypeOfContract.SeAccidentStudent]: ContractType.SwedishAccident,
  [TypeOfContract.NoHomeContentOwn]: ContractType.NorwegianHomeContent,
  [TypeOfContract.NoHomeContentRent]: ContractType.NorwegianHomeContent,
  [TypeOfContract.NoHomeContentYouthOwn]: ContractType.NorwegianHomeContent,
  [TypeOfContract.NoHomeContentYouthRent]: ContractType.NorwegianHomeContent,
  [TypeOfContract.NoTravel]: ContractType.NorwegianTravel,
  [TypeOfContract.NoTravelYouth]: ContractType.NorwegianTravel,
  [TypeOfContract.DkHomeContentOwn]: ContractType.DanishHomeContent,
  [TypeOfContract.DkHomeContentRent]: ContractType.DanishHomeContent,
  [TypeOfContract.DkHomeContentStudentOwn]: ContractType.DanishHomeContent,
  [TypeOfContract.DkHomeContentStudentRent]: ContractType.DanishHomeContent,
  [TypeOfContract.DkAccident]: ContractType.DanishAccident,
  [TypeOfContract.DkAccidentStudent]: ContractType.DanishAccident,
  [TypeOfContract.DkTravel]: ContractType.DanishTravel,
  [TypeOfContract.DkTravelStudent]: ContractType.DanishTravel,
}
