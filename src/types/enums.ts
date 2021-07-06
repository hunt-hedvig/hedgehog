export enum Market {
  Sweden = 'SWEDEN',
  Norway = 'NORWAY',
  Denmark = 'DENMARK',
}

export enum PickedLocale {
  SvSe = 'sv_SE',
  EnSe = 'en_SE',
  NbNo = 'nb_NO',
  EnNo = 'en_NO',
  DaDk = 'da_DK',
  EnDk = 'en_DK',
}

export enum QuoteProductType {
  Apartment = 'APARTMENT',
  House = 'HOUSE',
  Object = 'OBJECT',
  HomeContent = 'HOME_CONTENT',
  Travel = 'TRAVEL',
  Accident = 'ACCIDENT',
}

export enum ContractType {
  SwedishApartment = 'SWEDISH_APARTMENT',
  SwedishHouse = 'SWEDISH_HOUSE',
  NorwegianHomeContent = 'NORWEGIAN_HOME_CONTENT',
  NorwegianTravel = 'NORWEGIAN_TRAVEL',
  DanishHomeContent = 'DANISH_HOME_CONTENT',
  DanishTravel = 'DANISH_TRAVEL',
  DanishAccident = 'DANISH_ACCIDENT',
}

export enum TypeOfContract {
  SeHouse = 'SE_HOUSE',
  SeApartmentBrf = 'SE_APARTMENT_BRF',
  SeApartmentRent = 'SE_APARTMENT_RENT',
  SeApartmentStudentBrf = 'SE_APARTMENT_STUDENT_BRF',
  SeApartmentStudentRent = 'SE_APARTMENT_STUDENT_RENT',
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

export enum SwitcherTypes {
  SwedishHouse = 'SWEDISH_HOUSE',
  SwedishApartment = 'SWEDISH_APARTMENT',
  NorwegianHomeContent = 'NORWEGIAN_HOME_CONTENT',
  NorwegianTravel = 'NORWEGIAN_TRAVEL',
}

export const SwitcherTypeMarket: Record<SwitcherTypes, Market> = {
  [SwitcherTypes.SwedishHouse]: Market.Sweden,
  [SwitcherTypes.SwedishApartment]: Market.Sweden,
  [SwitcherTypes.NorwegianHomeContent]: Market.Norway,
  [SwitcherTypes.NorwegianTravel]: Market.Norway,
}
