import { useMutation } from '@apollo/react-hooks'
import styled from 'react-emotion'
import { SubmitButton } from './common'
import { useState } from 'react'
import * as React from 'react'
import { gql } from 'apollo-boost'
import { ApartmentQuoteData, QuoteData, QuoteResponseEntity } from './data'
import { QUOTES_QUERY } from './use-quotes'
import { Dropdown, Input as SuiInput } from 'semantic-ui-react'

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

const UPDATE_QUOTE_MUTATION = gql`
  mutation UpdateQuote($quoteId: ID!, $quoteData: QuoteInput!) {
    updateQuote(quoteId: $quoteId, quoteData: $quoteData) {
      id
    }
  }
`
export const QuoteModification: React.FunctionComponent<{
  memberId: string
  quote: QuoteResponseEntity<QuoteData>
  onWipChange?: (isWip: boolean) => void
  onSubmitted?: () => void
}> = function({
  memberId,
  quote,
  onWipChange = () => {},
  onSubmitted = () => {},
}) {
  const [modifyField, fieldModification] = useMutation(UPDATE_QUOTE_MUTATION, {
    refetchQueries: () => [{ query: QUOTES_QUERY, variables: { memberId } }],
  })
  const [street, setStreet] = useState<string | null>(null)
  const [zipCode, setZipCode] = useState<string | null>(null)
  const [city, setCity] = useState<string | null>(null)
  const [productType, setProductType] = useState<string | null>(null)
  const [livingSpace, setLivingSpace] = useState<number | null>(null)
  const [householdSize, setHouseholdSize] = useState<number | null>(null)

  const getInput = (
    variable: string,
    label: string,
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
        value={value ?? quote.data[variable]}
        id={`${variable}-${quote.id}`}
        type={inputType}
      />
    </>
  )

  return (
    <Wrapper
      onSubmit={async (e) => {
        e.preventDefault()

        if (fieldModification.loading) {
          return
        }

        const quoteData: any = {}
        const baseData = {
          street,
          zipCode,
          city,
          livingSpace,
          householdSize,
        }
        if (productType === 'HOUSE') {
          quoteData.houseData = {
            ...baseData,
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
            productType,
            quoteData,
          },
        })
        onSubmitted && onSubmitted()
      }}
    >
      <InputGroup>
        {getInput('street', 'Street', street, setStreet)}
        {getInput('zipCode', 'Zip code', zipCode, setZipCode)}
        {getInput('city', 'City', city, setCity)}
      </InputGroup>
      <InputGroup>
        <Label htmlFor={`producttype-${quote.id}`}>Product type</Label>
        <Dropdown
          fluid
          selection
          value={
            productType ??
            (quote.productType === 'APARTMENT'
              ? (quote.data as ApartmentQuoteData).subType
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

        {getInput(
          'livingSpace',
          'Living space (m2)',
          livingSpace,
          (val) => {
            setLivingSpace(parseInt(val as string))
          },
          'number',
        )}
        {getInput(
          'householdSize',
          'Household size (# of people)',
          householdSize,
          (val) => {
            setHouseholdSize(parseInt(val as string))
          },
          'number',
        )}
      </InputGroup>

      {productType === 'HOUSE' && (
        <InputGroup>Switching to HOUSE product not supported yet</InputGroup>
      )}

      <SubmitButton type="submit" disabled={fieldModification.loading}>
        Save modifications
      </SubmitButton>
      {}
    </Wrapper>
  )
}
