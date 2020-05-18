import { DropdownItemProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown/DropdownItem'
import {
  NorwegianHomeContentLineOfBusiness,
  NorwegianTravelLineOfBusiness,
  SwedishApartmentLineOfBusiness,
} from '../../../../api/generated/graphql'

export const swedishHouseDropdownItemProps = (): DropdownItemProps[] => [
  { text: 'House', value: 'HOUSE' },
]

export const swedishApartmentDropdownItemProps = (): DropdownItemProps[] => [
  {
    text: 'Apartment (rent)',
    value: SwedishApartmentLineOfBusiness.Rent,
  },
  {
    text: 'Apartment (brf)',
    value: SwedishApartmentLineOfBusiness.Brf,
  },
  {
    text: 'Apartment (student rent)',
    value: SwedishApartmentLineOfBusiness.StudentRent,
  },
  {
    text: 'Apartment (student brf)',
    value: SwedishApartmentLineOfBusiness.StudentBrf,
  },
]

export const norwegianTravelDropdownItemProps = (): DropdownItemProps[] => [
  {
    text: 'Norwegian Travel',
    value: NorwegianTravelLineOfBusiness.Regular,
  },
  {
    text: 'Norwegian Travel (youth)',
    value: NorwegianTravelLineOfBusiness.Youth,
  },
]

export const norwegianHomeContentDropdownItemProps = (): DropdownItemProps[] => [
  {
    text: 'Norwegian Home Content (own)',
    value: NorwegianHomeContentLineOfBusiness.Own,
  },
  {
    text: 'Norwegian Home Content (rent)',
    value: 'HOME_CONTENT_RENT',
  },
  {
    text: 'Norwegian Home Content (youth own)',
    value: NorwegianHomeContentLineOfBusiness.YouthOwn,
  },
  {
    text: 'Norwegian Home Content (youth rent)',
    value: NorwegianHomeContentLineOfBusiness.YouthRent,
  },
]
