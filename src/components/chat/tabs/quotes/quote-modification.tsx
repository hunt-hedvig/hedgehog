import { useMutation } from '@apollo/react-hooks'
import { colorsV2 } from '@hedviginsurance/brand/dist'
import {
  ApartmentQuoteData,
  ApartmentSubType,
  ExtraBuilding,
  ExtraBuildingType,
  HouseQuoteData,
  MutationType,
  MutationTypeUpdateQuoteArgs,
  Quote,
  QuoteData,
  QuoteInput,
  QuoteProductType,
} from 'api/generated/graphql'
import { gql } from 'apollo-boost'
import * as React from 'react'
import { useState } from 'react'
import styled from 'react-emotion'
import {
  Button,
  Checkbox,
  Dropdown,
  Input as SuiInput,
} from 'semantic-ui-react'
import * as uuid from 'uuid/v4'
import { ErrorMessage, SubmitButton } from './common'
import { QUOTES_QUERY } from './use-quotes'

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
}

const UPDATE_QUOTE_MUTATION = gql`
  mutation UpdateQuote($quoteId: ID!, $quoteData: QuoteInput!) {
    updateQuote(quoteId: $quoteId, quoteData: $quoteData) {
      id
    }
  }
`

function createQuoteData({
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
}: FormState & { quote: Quote }) {
  const quoteData: Partial<QuoteInput> = {
    productType: ((productType ?? quote.productType) === 'HOUSE'
      ? 'HOUSE'
      : 'APARTMENT') as QuoteProductType,
  }
  const baseData = {
    street,
    zipCode,
    city,
    livingSpace: parseInt(livingSpace!),
    householdSize: parseInt(householdSize!),
  }
  if ((productType ?? quote.productType) === 'HOUSE') {
    quoteData.houseData = {
      ...baseData,
      ancillaryArea: ancillaryArea !== null ? parseInt(ancillaryArea) : null,
      yearOfConstruction:
        yearOfConstruction !== null ? parseInt(yearOfConstruction) : null,
      numberOfBathrooms:
        numberOfBathrooms !== null ? parseInt(numberOfBathrooms) : null,
      extraBuildings: extraBuildings?.map(
        ({ area, type, hasWaterConnected }) => ({
          area,
          type,
          hasWaterConnected,
        }),
      ),
      isSubleted,
    }
  } else {
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
  extraBuildings: ReadonlyArray<EditableExtraBuilding>
  isSubleted: boolean | null
}

export const QuoteModification: React.FunctionComponent<{
  memberId: string
  quote: Quote
  onWipChange?: (isWip: boolean) => void
  onSubmitted?: () => void
}> = function({
  memberId,
  quote,
  onWipChange = () => {},
  onSubmitted = () => {},
}) {
  const [modifyField, fieldModification] = useMutation<
    Pick<MutationType, 'updateQuote'>,
    MutationTypeUpdateQuoteArgs
  >(UPDATE_QUOTE_MUTATION, {
    refetchQueries: () => [{ query: QUOTES_QUERY, variables: { memberId } }],
  })
  const [formState, setFormState] = useState<FormState>({
    street: null,
    city: null,
    ancillaryArea: null,
    extraBuildings:
      (quote.data as HouseQuoteData | null)?.extraBuildings?.map(
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

  const getTextInput = (
    variable: keyof FormState,
    label: React.ReactNode,
    inputType = 'text',
    value?: any,
  ) => (
    <>
      <Label htmlFor={`${variable}-${quote.id}`}>{label}</Label>
      <Input
        onChange={(e) => {
          onWipChange && onWipChange(true)
          setFormState({ ...formState, [variable]: e.currentTarget.value })
        }}
        value={
          value ?? formState[variable] ?? (quote.data as QuoteData)[variable]
        }
        id={`${variable}-${quote.id}`}
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

        const quoteData = createQuoteData({ ...formState, quote })

        await modifyField({
          variables: {
            quoteId: quote.id,
            quoteData,
          },
        })
        onSubmitted && onSubmitted()
      }}
    >
      <InputGroup>
        {getTextInput('street', 'Street')}
        {getTextInput('zipCode', 'Zip code')}
        {getTextInput('city', 'City')}
      </InputGroup>
      <InputGroup>
        <Label htmlFor={`producttype-${quote.id}`}>Product type</Label>
        <Dropdown
          fluid
          selection
          value={
            formState.productType ??
            (quote.productType === 'APARTMENT'
              ? ((quote.data as ApartmentQuoteData).subType as ApartmentSubType)
              : 'HOUSE')
          }
          onChange={(_, data) => {
            onWipChange && onWipChange(true)
            setFormState({ ...formState, productType: data.value as string })
          }}
          options={[
            { text: 'Apartment (rent)', value: 'RENT' },
            { text: 'Apartment (brf)', value: 'BRF' },
            { text: 'Apartment (student rent)', value: 'STUDENT_RENT' },
            { text: 'Apartment (student brf)', value: 'STUDENT_BRF' },
            { text: 'House', value: 'HOUSE' },
          ]}
        />

        {getNumberInput('livingSpace', 'Living space (m2)')}
        {getNumberInput('householdSize', 'Household size (# of people)')}
      </InputGroup>

      {(formState.productType ?? quote.productType) === 'HOUSE' && (
        <>
          <InputGroup>
            {getNumberInput(
              'ancillaryArea',
              <>
                Ancillary area (m<sup>2</sup>)
              </>,
              (formState.ancillaryArea === null
                ? quote.data!['ancillaryArea']
                : formState.ancillaryArea) ?? '0',
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
                (quote.data as HouseQuoteData).isSubleted ??
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

      <SubmitButton type="submit" disabled={fieldModification.loading}>
        Save modifications
      </SubmitButton>

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

const ExtraBuildingEditor: React.FunctionComponent<{
  extraBuildings: ReadonlyArray<EditableExtraBuilding>
  onChange: (value: ReadonlyArray<EditableExtraBuilding>) => void
}> = function({ extraBuildings, onChange }) {
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
        <ExtraBuildingWrapper key={extraBuilding?.id}>
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
                    ? parseInt(e.currentTarget.value)
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
              onChange={(_, { checked}) =>
                handleExtraBuildingChange(i)({
                  hasWaterConnected: checked,
                })
              }
            />
          </div>
          <RemoveButtonWrapper>
            <Button
              color="red"
              size="tiny"
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
