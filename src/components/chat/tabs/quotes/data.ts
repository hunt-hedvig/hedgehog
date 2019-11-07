export type ProductType = 'APARTMENT' | 'HOUSE' | 'OBJECT' | 'UNKNOWN'

export interface QuoteResponseEntity<TData extends QuoteData> {
  id: string
  createdAt: string
  price?: number
  productType?: TData['productType']
  state?: 'INCOMPLETE' | 'QUOTED' | 'SIGNED' | 'EXPIRED'
  initiatedFrom?: 'RAPIO' | 'WEBONBOARDING' | 'APP' | 'HOPE'
  attributedTo?: string
  currentInsurer?: string
  startDate?: string
  validity: number
  member: { id }
  isComplete: boolean
  data: TData
}

export interface QuoteData {
  id: string
  ssn?: string
  firstName?: string
  lastName?: string
  street?: string
  city?: string
  zipCode?: string
  householdSize?: number
  livingSpace?: number
  productType?: ProductType
}

export interface ApartmentQuoteData extends QuoteData {
  productType: 'APARTMENT'
  subType: string
}

export interface HouseQuoteData extends QuoteData {
  productType: 'HOUSE'
  ancillaryArea?: number
  yearOfConstruction?: number
  numberOfBathrooms?: number
  extraBuildings?: ReadonlyArray<{
    type: string
    area: number
    hasWaterConnected: boolean
    displayName?: string
  }>
  isSubleted?: boolean
}
