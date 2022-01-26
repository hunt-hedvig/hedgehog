import { MockedProvider } from '@apollo/client/testing'
import { sleep, tickAsync } from '@hedvig-ui/utils/sleep'
import { mount } from 'enzyme'
import { PaymentConfirmationModal } from 'portals/hope/features/claims/claim-details/ClaimPayments/components/PaymentConfirmationModal'
import React from 'react'
import { act } from 'react-dom/test-utils'
import {
  ClaimPaymentInput,
  ClaimPaymentType,
  CreateClaimPaymentDocument,
  MemberPaymentInformationDocument,
} from 'types/generated/graphql'
import { ClaimPaymentForm } from './ClaimPaymentForm'

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
  const wrapper = mount(
    <MockedProvider mocks={[PaymentInformationMock]}>
      <ClaimPaymentForm claimId="abc123" />
    </MockedProvider>,
  )

  await act(() => tickAsync())

  wrapper.update()

  await act(() => {
    wrapper.find('FormProvider').simulate('submit')
    return tickAsync()
  })

  expect(wrapper.exists(PaymentConfirmationModal)).toBe(false)
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

  const wrapper = mount(
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

  wrapper.update()

  await act(async () => {
    wrapper.find('input[name="amount"]').simulate('change', {
      target: { value: '100', name: 'amount' },
    })
    wrapper.find('input[name="deductible"]').simulate('change', {
      target: { value: '10', name: 'deductible' },
    })
    wrapper.find('input[name="note"]').simulate('change', {
      target: { value: 'test value with more than 5 chars', name: 'note' },
    })

    await tickAsync()

    wrapper.find('form').simulate('submit', {})
    await tickAsync()
  })

  wrapper.update()

  expect(wrapper.exists(PaymentConfirmationModal)).toBe(true)

  await act(async () => {
    wrapper
      .find(PaymentConfirmationModal)
      .find('input[name="confirmation"]')
      .simulate('change', { target: { value: '100' } })

    await tickAsync()

    wrapper.find(PaymentConfirmationModal).prop('onSubmit')()

    await tickAsync()
  })

  expect(paymentCreationCalled).toBe(true)
  expect(refetch).not.toHaveBeenCalled()

  await act(async () => {
    await sleep(1001)
    await tickAsync()
  })
})
