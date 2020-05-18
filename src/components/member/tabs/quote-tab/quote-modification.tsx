import { useMutation } from '@apollo/react-hooks'
import { colorsV2 } from '@hedviginsurance/brand/dist/colors'
import {
  ApartmentQuoteData,
  ApartmentSubType,
  Contract,
  ContractMarketInfo,
  ExtraBuilding,
  ExtraBuildingType,
  HouseQuoteData,
  MutationType,
  MutationTypeUpdateQuoteArgs,
  NorwegianHomeContentLineOfBusiness,
  NorwegianHomeContentQuoteData,
  NorwegianTravelLineOfBusiness,
  NorwegianTravelQuoteData,
  Quote,
  QuoteData,
  QuoteInput,
  QuoteProductType,
  SwedishApartmentLineOfBusiness,
  useCreateQuoteForNewContractMutation,
} from 'api/generated/graphql'
import { gql } from 'apollo-boost'
import { useContractMarketInfo } from 'graphql/use-get-member-contract-market-info'
import { QUOTES_QUERY } from 'graphql/use-quotes'
import { Button } from 'hedvig-ui/button'
import * as React from 'react'
import styled from 'react-emotion'
import { Checkbox, Dropdown, Input as SuiInput } from 'semantic-ui-react'
import { noopFunction } from 'utils'
import { isNorwegianMarket, isSwedishMarket } from 'utils/contract'
import {
  getSubType,
  isNorwegianHomeContent,
  isNorwegianTravel,
  isSwedishApartment,
  isSwedishHouse,
} from 'utils/quote'
import * as uuid from 'uuid/v4'
import { createQuoteForNewContractOptions } from '../../../../graphql/use-create-quote-for-new-contract'
import { showNotification } from '../../../../store/actions/notificationsActions'
import { ErrorMessage } from './common'
import { useContracts } from '../../../../graphql/use-contracts'
import { DropdownItemProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown/DropdownItem'

const Label = styled('label')({
  display: 'block',
  cursor: 'pointer',
  fontWeight: 'bold',
  marginTop: '1rem',
  marginBottom: '.5rem',
})
const Input = styled(SuiInput)({
  width: '100%',
})

const Wrapper = styled('form')({
  width: '100%',
  display: 'flex',
  flexWrap: 'wrap',
})
const InputGroup = styled('div')({
  width: '50%',
  paddingBottom: '2rem',
  ':nth-child(odd)': {
    paddingRight: '1rem',
  },
})

interface EditableExtraBuilding extends ExtraBuilding {
  id: string
  area: any | string | number | undefined
  displayName?: string
  hasWaterConnected: boolean
}

const UPDATE_QUOTE_MUTATION = gql`
  mutation UpdateQuote(
    $quoteId: ID!
    $quoteData: QuoteInput!
    $bypassUnderwritingGuidelines: Boolean
  ) {
    updateQuote(
      quoteId: $quoteId
      quoteData: $quoteData
      bypassUnderwritingGuidelines: $bypassUnderwritingGuidelines
    ) {
      id
    }
  }
`

const getProductSubTypeValue = (quote: Quote | null): string => {
  if (quote?.productType === 'APARTMENT') {
    return (quote.data as ApartmentQuoteData).subType!.toString()
  }
  if (quote?.productType === 'HOUSE') {
    return 'HOUSE'
  }
  if (quote?.productType === 'TRAVEL') {
    if (quote.data?.__typename === 'NorwegianTravelQuoteData') {
      // @ts-ignore
      return (quote.data as NorwegianTravelQuoteData).norwegianTravelSubType?.toString()
    }
  }
  if (quote?.productType === 'HOME_CONTENT') {
    const subType = getSubType(quote.data as NorwegianHomeContentQuoteData)
    return subType === NorwegianHomeContentLineOfBusiness.Rent
      ? 'HOME_CONTENT_RENT'
      : subType
  }
  return ''
}

const getProductType = (
  productType: string | null,
  contractMarket: ContractMarketInfo,
): QuoteProductType => {
  if (isSwedishMarket(contractMarket)) {
    return isSwedishHouseProductType(productType)
      ? QuoteProductType.House
      : QuoteProductType.Apartment
  }
  if (isNorwegianMarket(contractMarket)) {
    return isNorwegianTravelFormStateProductSubType(productType)
      ? QuoteProductType.Travel
      : QuoteProductType.HomeContent
  }
  throw Error(`Expected ${contractMarket.market} to be either Sweden or Norway`)
}

const isNorwegianTravelFormStateProductSubType = (
  productType: string | null,
): boolean => {
  return (
    productType === NorwegianTravelLineOfBusiness.Youth ||
    productType === NorwegianTravelLineOfBusiness.Regular
  )
}

const isSwedishHouseProductType = (productType: string | null): boolean => {
  return productType === 'HOUSE'
}

const isNorwegianHomeContentFormStateProductSubType = (
  productType: string | null,
): boolean => {
  if (productType === null) {
    return false
  }
  const subTypes: string[] = [
    NorwegianHomeContentLineOfBusiness.Own,
    'HOME_CONTENT_RENT',
    NorwegianHomeContentLineOfBusiness.YouthOwn,
    NorwegianHomeContentLineOfBusiness.YouthRent,
  ]
  return subTypes.includes(productType)
}

const isSwedishApartmentContentFormStateProductSubType = (
  productType: string | null,
): boolean => {
  if (productType === null) {
    return false
  }
  const subTypes: string[] = [
    ApartmentSubType.Brf,
    ApartmentSubType.Rent,
    ApartmentSubType.StudentBrf,
    ApartmentSubType.StudentRent,
  ]
  return subTypes.includes(productType)
}

const createQuoteData = ({
  contractMarket,
  productType,
  quote,
  street,
  zipCode,
  city,
  livingSpace,
  householdSize,
  ancillaryArea,
  yearOfConstruction,
  numberOfBathrooms,
  extraBuildings,
  isSubleted,
}: FormState & { quote: Quote; contractMarket: ContractMarketInfo }) => {
  const quoteData: Partial<QuoteInput> = {
    productType: getProductType(productType, contractMarket),
  }

  const baseData = {
    street,
    zipCode,
    city,
    livingSpace: parseInt(livingSpace!, 10),
    householdSize: parseInt(householdSize!, 10),
  }
  if (
    productType
      ? isSwedishHouseProductType(productType)
      : isSwedishHouse(quote?.data)
  ) {
    quoteData.houseData = {
      ...baseData,
      ancillaryArea:
        ancillaryArea !== null ? parseInt(ancillaryArea, 10) : null,
      yearOfConstruction:
        yearOfConstruction !== null ? parseInt(yearOfConstruction, 10) : null,
      numberOfBathrooms:
        numberOfBathrooms !== null ? parseInt(numberOfBathrooms, 10) : null,
      extraBuildings: extraBuildings?.map(
        ({ area, type, hasWaterConnected }) => ({
          area,
          type,
          hasWaterConnected,
        }),
      ),
      isSubleted: isSubleted ?? false,
    }
  }
  if (
    productType
      ? isNorwegianHomeContentFormStateProductSubType(productType)
      : isNorwegianHomeContent(quote?.data)
  ) {
    quoteData.norwegianHomeContentData = {
      ...baseData,
      subType:
        productType === 'HOME_CONTENT_RENT'
          ? NorwegianHomeContentLineOfBusiness.Rent
          : (productType as NorwegianHomeContentLineOfBusiness),
    }
  }

  if (
    productType
      ? isNorwegianTravelFormStateProductSubType(productType)
      : isNorwegianTravel(quote?.data)
  ) {
    quoteData.norwegianTravelData = {
      householdSize: parseInt(householdSize!, 10),
      subType: productType as NorwegianTravelLineOfBusiness,
    }
  }
  if (
    productType
      ? isSwedishApartmentContentFormStateProductSubType(productType)
      : isSwedishApartment(quote?.data)
  ) {
    quoteData.apartmentData = {
      ...baseData,
      subType: productType as ApartmentSubType,
    }
  }
  return quoteData
}

interface FormState {
  street: string | null
  zipCode: string | null
  city: string | null
  productType: string | null
  livingSpace: string | null
  householdSize: string | null
  ancillaryArea: string | null
  yearOfConstruction: string | null
  numberOfBathrooms: string | null
  extraBuildings: ReadonlyArray<ExtraBuilding>
  isSubleted: boolean | null
}

export const QuoteModification: React.FC<{
  memberId: string
  quote: Quote | null
  shouldCreateContract: boolean
  onWipChange?: (isWip: boolean) => void
  onSubmitted?: () => void
}> = ({
  memberId,
  quote,
  shouldCreateContract,
  onWipChange = noopFunction,
  onSubmitted = noopFunction,
}) => {
  const [createQuoteForNewContract] = useCreateQuoteForNewContractMutation()
  const [modifyField, fieldModification] = useMutation<
    Pick<MutationType, 'updateQuote'>,
    MutationTypeUpdateQuoteArgs
  >(UPDATE_QUOTE_MUTATION, {
    refetchQueries: () => [{ query: QUOTES_QUERY, variables: { memberId } }],
  })
  const [formState, setFormState] = React.useState<FormState>({
    street: null,
    city: null,
    ancillaryArea: null,
    extraBuildings:
      (quote?.data as HouseQuoteData | null)?.extraBuildings?.map(
        (extraBuilding) => ({ ...extraBuilding, id: uuid() }),
      ) ?? [],
    householdSize: null,
    isSubleted: null,
    livingSpace: null,
    numberOfBathrooms: null,
    productType: null,
    yearOfConstruction: null,
    zipCode: null,
  })

  const [contractMarket, { loading }] = useContractMarketInfo(memberId)
  const [contracts] = useContracts(memberId)

  if (loading) {
    return null
  }

  if (!contractMarket) {
    return <>Unable to get Market, please contact Tech</>
  }

  const [
    bypassUnderwritingGuidelines,
    setBypassUnderwritingGuidelines,
  ] = React.useState(false)

  const getProductTypeDropdown = () => (
    <Dropdown
      fluid
      selection
      value={formState.productType ?? getProductSubTypeValue(quote)}
      onChange={(_, data) => {
        if (onWipChange) {
          onWipChange(true)
        }
        setFormState({ ...formState, productType: data.value as string })
      }}
      options={getDropdownOptions(contractMarket, contracts)}
    />
  )

  const getSwedishDropDownOptions = (): DropdownItemProps[] => {
    console.log('BEFORE', formState.productType)
    const productType = formState.productType ?? getProductSubTypeValue(quote)
    if (productType !== '') {
      if (productType === 'HOUSE') {
        return [{ text: 'House', value: 'HOUSE' }]
      } else {
        return [
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
      }
    } else {
      if (contracts.length === 1) {
        if (contracts[0].contractTypeName === 'Swedish Apartment') {
          return [{ text: 'House', value: 'HOUSE' }]
        }
        if (contracts[0].contractTypeName === 'Swedish House') {
          return [
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
        }
      }
    }
    throw new Error('Cannot return dropDownItems')
  }

  const getDropdownOptions = (
    contractMarketInfo: ContractMarketInfo,
    contracts: ReadonlyArray<Contract>,
  ): DropdownItemProps[] => {
    if (isSwedishMarket(contractMarketInfo)) {
      console.log('I am here', getSwedishDropDownOptions())
      return getSwedishDropDownOptions()
    }
    if (isNorwegianMarket(contractMarketInfo)) {
      return [
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
        {
          text: 'Norwegian Travel',
          value: NorwegianTravelLineOfBusiness.Regular,
        },
        {
          text: 'Norwegian Travel (youth)',
          value: NorwegianTravelLineOfBusiness.Youth,
        },
      ]
    }
    throw new Error('Unknown market while generating dropdown options')
  }

  const getTextInput = (
    variable: keyof FormState,
    label: React.ReactNode,
    inputType = 'text',
    value?: any,
  ) => (
    <>
      <Label htmlFor={`${variable}-${quote?.id}`}>{label}</Label>
      <Input
        onChange={(e) => {
          if (onWipChange) {
            onWipChange(true)
          }
          setFormState({ ...formState, [variable]: e.currentTarget.value })
        }}
        value={
          value ??
          formState[variable] ??
          (quote ? (quote.data as QuoteData)[variable] : '')
        }
        id={`${variable}-${quote?.id}`}
        type={inputType}
      />
    </>
  )
  const getNumberInput = (
    variable: keyof FormState,
    label: React.ReactNode,
    value?: any,
  ) => getTextInput(variable, label, 'number', value)

  return (
    <Wrapper
      onSubmit={async (e) => {
        e.preventDefault()

        if (fieldModification.loading) {
          return
        }

        const quoteData = createQuoteData({
          ...formState,
          quote,
          contractMarket,
        })

        console.log(
          'QuoteData',
          quoteData,
          memberId,
          bypassUnderwritingGuidelines,
        )

        if (shouldCreateContract === true) {
          createQuoteForNewContract(
            createQuoteForNewContractOptions(
              memberId,
              quoteData,
              bypassUnderwritingGuidelines,
            ),
          )
            .then(() => {
              showNotification({
                type: 'olive',
                header: 'Success',
                message: `Successfully created quote for a new contract`,
              })
              // reset()
            })
            .catch((error) => {
              showNotification({
                type: 'red',
                header: 'Error',
                message: error.message,
              })
              throw error
            })
        } else {
          await modifyField({
            variables: {
              quoteId: quote!!.id,
              quoteData,
              bypassUnderwritingGuidelines,
            },
          })
        }

        if (onSubmitted) {
          onSubmitted()
        }
      }}
    >
      {(formState.productType
        ? isNorwegianTravelFormStateProductSubType(formState.productType)
        : isNorwegianTravel(quote?.data)) && (
        <InputGroup>
          <Label htmlFor={`producttype-${quote?.id}`}>Product type</Label>
          {getProductTypeDropdown()}
          {getNumberInput('householdSize', 'Household size (# of people)')}
        </InputGroup>
      )}
      {(formState.productType
        ? !isNorwegianTravelFormStateProductSubType(formState.productType)
        : !isNorwegianTravel(quote?.data)) && (
        <>
          <InputGroup>
            {getTextInput('street', 'Street')}
            {getTextInput('zipCode', 'Zip code')}
            {getTextInput('city', 'City')}
          </InputGroup>
          <InputGroup>
            <Label htmlFor={`producttype-${quote?.id}`}>Product type</Label>
            {getProductTypeDropdown()}
            {getNumberInput('livingSpace', 'Living space (m2)')}
            {getNumberInput('householdSize', 'Household size (# of people)')}
          </InputGroup>
        </>
      )}

      {(formState.productType ?? quote?.productType) === 'HOUSE' && (
        <>
          <InputGroup>
            {getNumberInput(
              'ancillaryArea',
              <>
                Ancillary area (m<sup>2</sup>)
              </>,
              (formState.ancillaryArea === null
                ? (quote?.data as HouseQuoteData)!.ancillaryArea
                : formState.ancillaryArea) ?? '',
            )}
            {getNumberInput('yearOfConstruction', 'Year of construction')}
            {getNumberInput('numberOfBathrooms', 'Number of bathrooms')}
            <Label>Is subleted</Label>
            <Checkbox
              onChange={(_, { checked }) => {
                setFormState({
                  ...formState,
                  isSubleted: checked!,
                })
              }}
              label="Is subleted"
              checked={
                formState.isSubleted ??
                (quote?.data as HouseQuoteData).isSubleted ??
                false
              }
            />
          </InputGroup>
          <InputGroup>
            <ExtraBuildingEditor
              extraBuildings={formState.extraBuildings ?? []}
              onChange={(extraBuildings) =>
                setFormState({ ...formState, extraBuildings })
              }
            />
          </InputGroup>
        </>
      )}

      <InputGroup>
        <Checkbox
          checked={bypassUnderwritingGuidelines}
          onChange={(_, { checked }) =>
            setBypassUnderwritingGuidelines(checked!)
          }
          label="Bypass underwriting guidelines"
        />
      </InputGroup>

      <Button
        variation="success"
        type="submit"
        disabled={fieldModification.loading}
      >
        Save modifications
      </Button>

      {fieldModification.error && (
        <ErrorMessage>
          {JSON.stringify(fieldModification.error, null, 2)}
        </ErrorMessage>
      )}
    </Wrapper>
  )
}

const ExtraBuildingEditorWrapper = styled('div')({
  border: '1px solid ' + colorsV2.semilightgray,
  padding: '1rem 0',
})
const ExtraBuildingWrapper = styled('div')({
  borderBottom: '1px solid ' + colorsV2.semilightgray,
  marginBottom: '1rem',
  padding: '1rem',
  paddingTop: 0,

  ':nth-child(odd)': {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
})
const RemoveButtonWrapper = styled('div')({
  textAlign: 'right',
  paddingTop: '1rem',
})

const ExtraBuildingEditor: React.FC<{
  extraBuildings: ReadonlyArray<ExtraBuilding>
  onChange: (value: ReadonlyArray<ExtraBuilding>) => void
}> = ({ extraBuildings, onChange }) => {
  const handleExtraBuildingChange = (index: number) => (
    data: Partial<EditableExtraBuilding>,
  ) => {
    onChange(
      extraBuildings.map((extraBuilding, i) =>
        i === index ? { ...extraBuilding, ...data } : extraBuilding,
      ),
    )
  }
  return (
    <ExtraBuildingEditorWrapper>
      <div>
        <strong>Extra buildings</strong>
      </div>
      {extraBuildings.map((extraBuilding, i) => (
        <ExtraBuildingWrapper key={extraBuilding?.id ?? undefined}>
          <div>
            <Label htmlFor={`area-${extraBuilding?.id}`}>Area</Label>
            <Input
              id={`area-${extraBuilding}`}
              label="m2"
              labelPosition="right"
              type="number"
              value={extraBuilding.area}
              onChange={(e) =>
                handleExtraBuildingChange(i)({
                  area: e.currentTarget.value
                    ? parseInt(e.currentTarget.value, 10)
                    : '',
                })
              }
            />
          </div>
          <div>
            <Label htmlFor={`type-${extraBuilding.id}`}>Type</Label>
            <Dropdown
              id={`type-${extraBuilding.id}`}
              fluid
              selection
              options={Object.values(ExtraBuildingType).map((type) => ({
                text: type,
                value: type,
              }))}
              value={extraBuilding.type}
              onChange={(_, newValue) =>
                handleExtraBuildingChange(i)({
                  type: newValue.value as ExtraBuildingType,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor={`hasWaterConnected-${extraBuilding.id}`}>
              Water connection
            </Label>
            <Checkbox
              id={`hasWaterConnected-${extraBuilding.id}`}
              label="Has water connected"
              checked={extraBuilding.hasWaterConnected}
              onChange={(_, { checked }) =>
                handleExtraBuildingChange(i)({
                  hasWaterConnected: checked,
                })
              }
            />
          </div>
          <RemoveButtonWrapper>
            <Button
              variation="danger"
              size="small"
              type="button"
              onClick={(e) => {
                e.preventDefault()
                if (
                  confirm(
                    `Are you sure you want to remove the extra building "${extraBuilding.displayName}"?`,
                  )
                ) {
                  onChange(
                    extraBuildings.filter(({ id }) => id !== extraBuilding.id),
                  )
                }
              }}
            >
              Remove
            </Button>
          </RemoveButtonWrapper>
        </ExtraBuildingWrapper>
      ))}
      <Button
        onClick={(e) => {
          e.preventDefault()
          onChange([
            ...extraBuildings,
            {
              area: 0,
              hasWaterConnected: false,
              id: uuid(),
              type: ExtraBuildingType.Attefall,
            },
          ])
        }}
        type="button"
      >
        + Add
      </Button>
    </ExtraBuildingEditorWrapper>
  )
}
