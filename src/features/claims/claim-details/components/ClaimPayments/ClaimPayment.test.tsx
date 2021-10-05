import { MockedProvider } from '@apollo/client/testing'
import { mount } from 'enzyme'
import { PaymentConfirmationModal } from 'features/claims/claim-details/components/ClaimPayments/PaymentConfirmationModal'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Market } from 'types/enums'
import {
  ClaimPaymentInput,
  ClaimPaymentType,
  CreateClaimPaymentDocument,
  SanctionStatus,
} from 'types/generated/graphql'
import { sleep, tickAsync } from 'utils/sleep'
import { ClaimPayment } from './ClaimPayment'

it("doesn't submit empty form", async () => {
  const wrapper = mount(
    <MockedProvider>
      <ClaimPayment
        focus={false}
        sanctionStatus={SanctionStatus.NoHit}
        claimId="abc123"
        identified={true}
        market={Market.Sweden}
        carrier="Hedvig"
      />
    </MockedProvider>,
  )

  await act(() => tickAsync())

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
    carrier: 'Hedvig',
    type: ClaimPaymentType.Automatic,
  }

  const wrapper = mount(
    <MockedProvider
      mocks={[
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
      <ClaimPayment
        focus={false}
        sanctionStatus={SanctionStatus.NoHit}
        claimId="abc123"
        identified={true}
        market={Market.Sweden}
        carrier="Hedvig"
      />
    </MockedProvider>,
  )

  await act(() => tickAsync())

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
