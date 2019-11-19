import { useMutation } from '@apollo/react-hooks'
import { colorsV2 } from '@hedviginsurance/brand/dist'
import {
  ApartmentQuoteData,
  ApartmentSubType,
  ExtraBuilding, ExtraBuildingType,
  HouseQuoteData,
  Quote,
  QuoteData
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
export const QuoteModification: React.FunctionComponent<{
  memberId: string
  quote: Quote
  onWipChange?: (isWip: boolean) => void
  onSubmitted?: () => void
}> = function ({
                 memberId,
                 quote,
                 onWipChange = () => {
                 },
                 onSubmitted = () => {
                 },
               }) {
  const [modifyField, fieldModification] = useMutation(UPDATE_QUOTE_MUTATION, {
    refetchQueries: () => [{ query: QUOTES_QUERY, variables: { memberId } }],
  })
  const [street, setStreet] = useState<string | null>(null)
  const [zipCode, setZipCode] = useState<string | null>(null)
  const [city, setCity] = useState<string | null>(null)
  const [productType, setProductType] = useState<string | null>(null)
  const [livingSpace, setLivingSpace] = useState<string | null>(null)
  const [householdSize, setHouseholdSize] = useState<string | null>(null)
  const [ancillaryArea, setAncillaryArea] = useState<string | null>('0')
  const [yearOfConstruction, setYearOfConstruction] = useState<string | null>(
    null,
  )
  const [numberOfBathrooms, setNumberOfBathrooms] = useState<string | null>(
    null,
  )
  const [extraBuildings, setExtraBuildings] = useState<ReadonlyArray<EditableExtraBuilding>>(
    ((quote.data as HouseQuoteData | null)?.extraBuildings?.map(
      (extraBuilding) => ({ ...extraBuilding, id: uuid() }),
    ) ?? []),
  )
  const [isSubleted, setIsSubleted] = useState<boolean | null>(null)

  const getTextInput = (
    variable: string,
    label: React.ReactNode,
    value: string | number | null,
    setter: (val: any) => void,
    inputType = 'text',
  ) => (
    <>
      <Label htmlFor={`${variable}-${quote.id}`}>{label}</Label>
      <Input
        onChange={(e) => {
          onWipChange && onWipChange(true)
          setter(e.currentTarget.value)
        }}
        value={value ?? (quote.data as QuoteData)[variable]}
        id={`${variable}-${quote.id}`}
        type={inputType}
      />
    </>
  )
  const getNumberInput = (
    variable: string,
    label: React.ReactNode,
    value: string | number | null,
    setter: (val: any) => void,
  ) => getTextInput(variable, label, value, setter, 'number')

  return (
    <Wrapper
      onSubmit={async (e) => {
        e.preventDefault()

        if (fieldModification.loading) {
          return
        }

        const quoteData: any = {
          productType:
            (productType ?? quote.productType) === 'HOUSE'
              ? 'HOUSE'
              : 'APARTMENT',
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
            ancillaryArea: parseInt(ancillaryArea!),
            yearOfConstruction: parseInt(yearOfConstruction!),
            numberOfBathrooms: parseInt(numberOfBathrooms!),
            extraBuildings: extraBuildings?.map(
              ({ area, type, hasWaterConnected }) => ({
                area,
                type,
                hasWaterConnected,
              }),
            ),
            isSubleted: isSubleted ?? (quote.data as HouseQuoteData)?.isSubleted ?? false,
          }
        } else {
          quoteData.apartmentData = {
            ...baseData,
            subType: productType,
          }
        }

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
        {getTextInput('street', 'Street', street, setStreet)}
        {getTextInput('zipCode', 'Zip code', zipCode, setZipCode)}
        {getTextInput('city', 'City', city, setCity)}
      </InputGroup>
      <InputGroup>
        <Label htmlFor={`producttype-${quote.id}`}>Product type</Label>
        <Dropdown
          fluid
          selection
          value={
            productType ??
            (quote.productType === 'APARTMENT'
              ? (quote.data as ApartmentQuoteData).subType as ApartmentSubType
              : 'HOUSE')
          }
          onChange={(_, data) => {
            onWipChange && onWipChange(true)
            setProductType(data.value as string)
          }}
          options={[
            { text: 'Apartment (rent)', value: 'RENT' },
            { text: 'Apartment (brf)', value: 'BRF' },
            { text: 'Apartment (student rent)', value: 'STUDENT_RENT' },
            { text: 'Apartment (student brf)', value: 'STUDENT_BRF' },
            { text: 'House', value: 'HOUSE' },
          ]}
        />

        {getNumberInput(
          'livingSpace',
          'Living space (m2)',
          livingSpace,
          setLivingSpace,
        )}
        {getNumberInput(
          'householdSize',
          'Household size (# of people)',
          householdSize,
          setHouseholdSize,
        )}
      </InputGroup>

      {(productType ?? quote.productType) === 'HOUSE' && (
        <>
          <InputGroup>
            {getNumberInput(
              'ancillaryArea',
              <>
                Ancillary area (m<sup>2</sup>)
              </>,
              (ancillaryArea === '0' ? quote.data!['ancillaryArea'] : ancillaryArea) ?? '0',
              setAncillaryArea,
            )}
            {getNumberInput(
              'yearOfConstruction',
              'Year of construction',
              yearOfConstruction ?? quote.data!['yearOfConstruction'] ?? '',
              setYearOfConstruction,
            )}
            {getNumberInput(
              'numberOfBathrooms',
              'Number of bathrooms',
              numberOfBathrooms ?? quote.data!['numberOfBathrooms'] ?? '',
              setNumberOfBathrooms,
            )}
            <Label>Is subleted</Label>
            <Checkbox
              onClick={(e) => setIsSubleted(e.currentTarget.checked)}
              label="Is subleted"
              value={isSubleted ?? false as any}
            />
          </InputGroup>
          <InputGroup>
            <ExtraBuildingEditor
              extraBuildings={extraBuildings ?? []}
              onChange={setExtraBuildings}
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
}> = function ({ extraBuildings, onChange }) {
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
                handleExtraBuildingChange(i)({ type: newValue.value as ExtraBuildingType })
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
              value={extraBuilding.hasWaterConnected as any}
              onChange={(e) =>
                handleExtraBuildingChange(i)({
                  hasWaterConnected: e.currentTarget.checked,
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
