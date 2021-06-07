import { MockedProvider } from '@apollo/client/testing'
import {
  ClaimPaymentInput,
  ClaimPaymentType,
  CreateClaimPaymentDocument,
  SanctionStatus,
} from 'api/generated/graphql'
import { mount } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Market } from 'types/enums'
import { sleep, tickAsync } from 'utils/sleep'
import { ClaimPaymentComponent } from './ClaimPayment'
import { PaymentConfirmationDialog } from './PaymentConfirmationDialog'

it("doesn't submit empty form", async () => {
  const refetchPage = jest.fn(() => Promise.resolve())
  const showNotification = jest.fn()
  const wrapper = mount(
    <MockedProvider>
      <ClaimPaymentComponent
        sanctionStatus={SanctionStatus.NoHit}
        showNotification={showNotification}
        claimId={'abc123'}
        refetch={refetchPage}
        identified={true}
        market={Market.Sweden}
        carrier="Hedvig"
      />
    </MockedProvider>,
  )

  await act(() => tickAsync())

  await act(() => {
    wrapper.find('Form').simulate('submit')
    return tickAsync()
  })

  expect(wrapper.exists(PaymentConfirmationDialog)).toBe(false)
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
  const showNotification = jest.fn()

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
      <ClaimPaymentComponent
        sanctionStatus={SanctionStatus.NoHit}
        claimId={'abc123'}
        refetch={refetch}
        identified={true}
        market={Market.Sweden}
        carrier="Hedvig"
        showNotification={showNotification}
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
    // Manually trigger `onChange` because MUI doesn't support native `change` simulations
    wrapper.find('SelectInput[name="type"]').prop('onChange')!({
      target: {
        value: ClaimPaymentType.Automatic,
        name: 'type',
      },
    } as any)
    await tickAsync()

    wrapper.find('form').simulate('submit', {})
    await tickAsync()
  })

  wrapper.update()

  expect(wrapper.exists(PaymentConfirmationDialog)).toBe(true)

  await act(async () => {
    wrapper
      .find(PaymentConfirmationDialog)
      .find('TextField[name="confirmation"]')
      .simulate('change', { target: { value: '100' } })

    await tickAsync()

    wrapper.find(PaymentConfirmationDialog).prop('onSubmit')()

    await tickAsync()
  })

  expect(paymentCreationCalled).toBe(true)
  expect(refetch).not.toHaveBeenCalled()

  await act(async () => {
    await sleep(1001)
    await tickAsync()
  })

  expect(refetch).toHaveBeenCalled()
  expect(showNotification.mock.calls[0][0]).toEqual(
    expect.objectContaining({ type: 'olive', header: 'Success' }),
  )
})