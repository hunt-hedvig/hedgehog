import { MockedProvider } from '@apollo/client/testing'
import { sleep, tickAsync } from '@hedvig-ui/utils/sleep'
import React from 'react'
import { act } from 'react-dom/test-utils'
import {
  ClaimPaymentInput,
  ClaimPaymentType,
  CreateClaimPaymentDocument,
  MemberPaymentInformationDocument,
} from 'types/generated/graphql'
import { ClaimPaymentForm } from './ClaimPaymentForm'
import { fireEvent, render } from '@testing-library/react'

const PaymentInformationMock = {
  request: {
    query: MemberPaymentInformationDocument,
    variables: {
      claimId: 'abc123',
    },
  },
  result: {
    data: {
      claim: {
        contract: {
          id: 'contract-id',
        },
        agreement: {
          id: 'agreement-id',
          carrier: 'HEDVIG',
        },
        trial: null,
        member: {
          memberId: 'member-id',
          transactions: [],
          sanctionStatus: null,
          contractMarketInfo: {
            market: 'SWEDEN',
            preferredCurrency: 'SEK',
          },
          directDebitStatus: null,
          payoutMethodStatus: null,
          adyenShopperReference: null,
          identity: null,
        },
      },
    },
  },
}

it("doesn't submit empty form", async () => {
  const wrapper = render(
    <MockedProvider mocks={[PaymentInformationMock]}>
      <ClaimPaymentForm claimId="abc123" />
    </MockedProvider>,
  )

  await act(() => tickAsync())

  await act(async () => {
    wrapper.getByText('Create payment').click()
    return tickAsync()
  })

  expect(wrapper.queryByText('To perform the payment')).toBeNull()
})

it('submits valid form with confirmation', async () => {
  const refetch = jest.fn(() => Promise.resolve())
  let paymentCreationCalled = false

  const payment: ClaimPaymentInput = {
    amount: {
      amount: 100,
      currency: 'SEK',
    },
    deductible: { amount: 10, currency: 'SEK' },
    sanctionListSkipped: false,
    note: 'test value with more than 5 chars',
    exGratia: false,
    carrier: 'HEDVIG',
    type: ClaimPaymentType.Automatic,
    paidAt: null,
  }

  const wrapper = render(
    <MockedProvider
      mocks={[
        PaymentInformationMock,
        {
          request: {
            query: CreateClaimPaymentDocument,
            variables: {
              id: 'abc123',
              payment,
            },
          },
          result: () => {
            paymentCreationCalled = true
            return {
              data: {
                createClaimPayment: {
                  __typename: 'Claim',
                  payments: [{ __typename: 'ClaimPayment', id: '321cba' }],
                },
              },
            }
          },
        },
      ]}
    >
      <ClaimPaymentForm claimId="abc123" />
    </MockedProvider>,
  )

  await act(() => tickAsync())

  await act(async () => {
    const amountInput = wrapper.getByPlaceholderText('Payout amount')
    const deductibleInput = wrapper.getByPlaceholderText('Deductible')
    const noteInput = wrapper.getByPlaceholderText('Note')

    fireEvent.change(amountInput, {
      target: { value: '100', name: 'amount' },
    })

    fireEvent.change(deductibleInput, {
      target: { value: '10', name: 'deductible' },
    })

    fireEvent.change(noteInput, {
      target: { value: 'test value with more than 5 chars', name: 'note' },
    })

    await tickAsync()

    wrapper.getByText('Create payment').click()
    await tickAsync()
  })

  expect(wrapper.queryByText('To perform the payment')).toBeDefined()

  await act(async () => {
    fireEvent.change(wrapper.getByPlaceholderText('Amount'), {
      target: { value: '100' },
    })

    await tickAsync()

    wrapper.getByText('Confirm').click()

    await tickAsync()
  })

  expect(paymentCreationCalled).toBe(true)
  expect(refetch).not.toHaveBeenCalled()

  await act(async () => {
    await sleep(1001)
    await tickAsync()
  })
})
