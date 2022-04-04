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

export const MarketLanguage: Record<Market, String> = {
  [Market.Sweden]: 'se',
  [Market.Norway]: 'no',
  [Market.Denmark]: 'da',
}

export const MemberGroups: Record<string, number> = {
  First: 1,
  Second: 2,
  Third: 3,
  Fourth: 4,
}

export const MemberGroupColors: Record<string, string> = {
  [MemberGroups.First]: lightTheme.danger,
  [MemberGroups.Second]: lightTheme.success,
  [MemberGroups.Third]: lightTheme.highlight,
  [MemberGroups.Fourth]: lightTheme.warning,
}

export enum InsuranceType {
  SwedishApartment = 'SWEDISH_APARTMENT',
  SwedishHouse = 'SWEDISH_HOUSE',
  SwedishAccident = 'SWEDISH_ACCIDENT',
  NorwegianHomeContent = 'NORWEGIAN_HOME_CONTENT',
  NorwegianTravel = 'NORWEGIAN_TRAVEL',
  NorwegianAccident = 'NORWEGIAN_ACCIDENT',
  NorwegianHouse = 'NORWEGIAN_HOUSE',
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
  InsuranceType[]
> = {
  [QuoteProductType.HomeContent]: [
    InsuranceType.NorwegianHomeContent,
    InsuranceType.DanishHomeContent,
  ],
  [QuoteProductType.Apartment]: [InsuranceType.SwedishApartment],
  [QuoteProductType.Accident]: [
    InsuranceType.DanishAccident,
    InsuranceType.SwedishAccident,
    InsuranceType.NorwegianAccident,
  ],
  [QuoteProductType.House]: [
    InsuranceType.SwedishHouse,
    InsuranceType.NorwegianHouse,
  ],
  [QuoteProductType.Object]: [],
  [QuoteProductType.Travel]: [
    InsuranceType.NorwegianTravel,
    InsuranceType.DanishTravel,
  ],
}

export const ContractMarketTypes: Record<Market, InsuranceType[]> = {
  SWEDEN: [
    InsuranceType.SwedishHouse,
    InsuranceType.SwedishApartment,
    InsuranceType.SwedishAccident,
  ],
  NORWAY: [
    InsuranceType.NorwegianHomeContent,
    InsuranceType.NorwegianTravel,
    InsuranceType.NorwegianAccident,
    InsuranceType.NorwegianHouse,
  ],
  DENMARK: [
    InsuranceType.DanishHomeContent,
    InsuranceType.DanishTravel,
    InsuranceType.DanishAccident,
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
  NoAccident = 'NO_ACCIDENT',
  NoHouse = 'NO_HOUSE',
  DkHomeContentOwn = 'DK_HOME_CONTENT_OWN',
  DkHomeContentRent = 'DK_HOME_CONTENT_RENT',
  DkHomeContentStudentOwn = 'DK_HOME_CONTENT_STUDENT_OWN',
  DkHomeContentStudentRent = 'DK_HOME_CONTENT_STUDENT_RENT',
  DkAccident = 'DK_ACCIDENT',
  DkAccidentStudent = 'DK_ACCIDENT_STUDENT',
  DkTravel = 'DK_TRAVEL',
  DkTravelStudent = 'DK_TRAVEL_STUDENT',
}

export const TypeOfContractType: Record<TypeOfContract, InsuranceType> = {
  [TypeOfContract.SeHouse]: InsuranceType.SwedishHouse,
  [TypeOfContract.SeApartmentBrf]: InsuranceType.SwedishApartment,
  [TypeOfContract.SeApartmentRent]: InsuranceType.SwedishApartment,
  [TypeOfContract.SeApartmentStudentBrf]: InsuranceType.SwedishApartment,
  [TypeOfContract.SeApartmentStudentRent]: InsuranceType.SwedishApartment,
  [TypeOfContract.SeAccident]: InsuranceType.SwedishAccident,
  [TypeOfContract.SeAccidentStudent]: InsuranceType.SwedishAccident,
  [TypeOfContract.NoHomeContentOwn]: InsuranceType.NorwegianHomeContent,
  [TypeOfContract.NoHomeContentRent]: InsuranceType.NorwegianHomeContent,
  [TypeOfContract.NoHomeContentYouthOwn]: InsuranceType.NorwegianHomeContent,
  [TypeOfContract.NoHomeContentYouthRent]: InsuranceType.NorwegianHomeContent,
  [TypeOfContract.NoTravel]: InsuranceType.NorwegianTravel,
  [TypeOfContract.NoTravelYouth]: InsuranceType.NorwegianTravel,
  [TypeOfContract.NoAccident]: InsuranceType.NorwegianAccident,
  [TypeOfContract.NoHouse]: InsuranceType.NorwegianHouse,
  [TypeOfContract.DkHomeContentOwn]: InsuranceType.DanishHomeContent,
  [TypeOfContract.DkHomeContentRent]: InsuranceType.DanishHomeContent,
  [TypeOfContract.DkHomeContentStudentOwn]: InsuranceType.DanishHomeContent,
  [TypeOfContract.DkHomeContentStudentRent]: InsuranceType.DanishHomeContent,
  [TypeOfContract.DkAccident]: InsuranceType.DanishAccident,
  [TypeOfContract.DkAccidentStudent]: InsuranceType.DanishAccident,
  [TypeOfContract.DkTravel]: InsuranceType.DanishTravel,
  [TypeOfContract.DkTravelStudent]: InsuranceType.DanishTravel,
}
