import { useMutation } from '@apollo/react-hooks'
import { colorsV2 } from '@hedviginsurance/brand/dist'
import {
  MutationType,
  MutationTypeCreateQuoteFromProductArgs,
  QuoteFromProductInput,
} from 'api/generated/graphql'
import { gql } from 'apollo-boost'
import { QUOTES_QUERY, useQuotes } from 'components/chat/tabs/quotes/use-quotes'
import * as React from 'react'
import { useState } from 'react'
import styled from 'react-emotion'
import { Button, Modal } from 'semantic-ui-react'

export const createQuoteFromProductRequest = (modifiedDetails) => {
  const requestData: QuoteFromProductInput = {
    originatingProductId: modifiedDetails.productId,
    currentInsurer: modifiedDetails.currentInsurer,
  }
  const requestQuoteData = {
    street: modifiedDetails.street,
    city: modifiedDetails.city,
    zipCode: modifiedDetails.zipCode,
    livingSpace: modifiedDetails.livingSpace,
    householdSize: modifiedDetails.personsInHouseHold,
  }

  if (modifiedDetails.insuranceType === 'HOUSE') {
    requestData.incompleteHouseQuoteData = {
      ...requestQuoteData,
      ancillaryArea: modifiedDetails.ancillaryArea,
      yearOfConstruction: modifiedDetails.yearOfConstruction,
      numberOfBathrooms: modifiedDetails.numberOfBathrooms,
      extraBuildings: modifiedDetails.extraBuildings?.map(
        ({ area, hasWaterConnected, type }) => ({
          area,
          hasWaterConnected,
          type,
        }),
      ),
      isSubleted: modifiedDetails.isSubleted,
    }
  } else {
    requestData.incompleteApartmentQuoteData = {
      ...requestQuoteData,
      subType: modifiedDetails.insuranceType,
    }
  }

  return requestData
}

const CREATE_QUOTE_FROM_PRODUCT_MUTATION = gql`
  mutation CreateQuoteFromProduct(
    $memberId: ID!
    $quoteData: QuoteFromProductInput!
  ) {
    createQuoteFromProduct(memberId: $memberId, quoteData: $quoteData) {
      id
    }
  }
`

const SuccessMessage = styled('h3')({
  color: colorsV2.grass500,
})

export const CreateQuote: React.FunctionComponent<{
  memberId: string
  insurance: any
}> = function({ memberId, insurance }) {
  const [quotes, loadingQuotes] = useQuotes(memberId)
  const [modalOpen, setModalOpen] = useState(false)
  const [createQuoteFromProduct, createQuoteMutation] = useMutation<
    Pick<MutationType, 'createQuoteFromProduct'>,
    MutationTypeCreateQuoteFromProductArgs
  >(CREATE_QUOTE_FROM_PRODUCT_MUTATION, {
    refetchQueries: () => [
      {
        query: QUOTES_QUERY,
        variables: { memberId },
      },
    ],
  })

  return (
    <Modal
      trigger={
        quotes
          .map((quote) => quote.originatingProductId)
          .includes(insurance.productId) && !loadingQuotes ? (
          <>Insurance has existing quote</>
        ) : (
          !loadingQuotes && (
            <Button onClick={() => setModalOpen(true)}>Create quote</Button>
          )
        )
      }
      open={modalOpen}
      size="tiny"
      onClose={() => setModalOpen(false)}
    >
      <Modal.Content>
        {createQuoteMutation &&
        createQuoteMutation.data &&
        createQuoteMutation.data.createQuoteFromProduct ? (
          <>
            <SuccessMessage>Quote created!</SuccessMessage>
            <p>
              Go to the quotes tab to change the details and activate the quote.
            </p>
            <Button onClick={() => setModalOpen(false)}>Close</Button>
          </>
        ) : (
          <h3>Create quote?</h3>
        )}
      </Modal.Content>
      {!(
        createQuoteMutation &&
        createQuoteMutation.data &&
        createQuoteMutation.data.createQuoteFromProduct
      ) && (
        <Modal.Actions>
          <Button.Group>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>

            <Button
              onClick={async () => {
                const quoteData = createQuoteFromProductRequest(insurance)
                await createQuoteFromProduct({
                  variables: { memberId, quoteData },
                })
              }}
              positive
              disabled={
                createQuoteMutation.loading ||
                createQuoteMutation.called ||
                Boolean(
                  createQuoteMutation.data &&
                    createQuoteMutation.data &&
                    createQuoteMutation.data.createQuoteFromProduct,
                )
              }
            >
              Create quote
            </Button>
          </Button.Group>
        </Modal.Actions>
      )}
    </Modal>
  )
}
