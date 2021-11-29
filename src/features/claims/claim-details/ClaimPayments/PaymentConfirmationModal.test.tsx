import { tickAsync } from '@hedvig-ui/utils/sleep'
import { mount } from 'enzyme'
import { Market } from 'features/config/constants'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { PaymentConfirmationModal } from './PaymentConfirmationModal'

it("doesn't submit an empty form", async () => {
  const onClose = jest.fn()
  const onSubmit = jest.fn()
  const wrapper = mount(
    <PaymentConfirmationModal
      onClose={onClose}
      onSubmit={onSubmit}
      amount="100"
      identified
      market={Market.Sweden}
    />,
  )

  expect(wrapper.find('input[name="confirmation"]').prop('value')).toBe('')
  expect(
    wrapper
      .find(PaymentConfirmationModal)
      .find('button[type="submit"]')
      .prop('disabled'),
  ).toBe(true)

  await act(async () => {
    wrapper.find('button[type="submit"]').simulate('click')
    await tickAsync()
  })

  expect(onClose).not.toHaveBeenCalled()
  expect(onSubmit).not.toHaveBeenCalled()
})

it("doesn't submit an invalid form", async () => {
  const onClose = jest.fn()
  const onSubmit = jest.fn()
  const wrapper = mount(
    <PaymentConfirmationModal
      onClose={onClose}
      onSubmit={onSubmit}
      amount="100"
      identified
      market={Market.Sweden}
    />,
  )

  await act(async () => {
    wrapper
      .find('input[name="confirmation"]')
      .simulate('change', { target: { value: '1337' } })
    await tickAsync()
  })

  expect(wrapper.find('button[type="submit"]').prop('disabled')).toBe(true)

  await act(async () => {
    wrapper.find('button[type="submit"]').simulate('click')
    await tickAsync()
  })

  expect(onClose).not.toHaveBeenCalled()
  expect(onSubmit).not.toHaveBeenCalled()
})

it('submits a valid form', async () => {
  const onClose = jest.fn()
  const onSubmit = jest.fn()
  const wrapper = mount(
    <PaymentConfirmationModal
      onClose={onClose}
      onSubmit={onSubmit}
      amount="100"
      identified
      market={Market.Sweden}
    />,
  )

  await act(async () => {
    wrapper
      .find('input[name="confirmation"]')
      .simulate('change', { currentTarget: { value: '100' } })
    await tickAsync()
  })

  wrapper.update()

  await act(async () => {
    wrapper
      .find('button[type="submit"]')
      .prop('onClick')
      ?.call({}, {} as any)
    await tickAsync()
  })

  expect(onClose).toHaveBeenCalled()
  expect(onSubmit).toHaveBeenCalled()
})
