import { mount } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Market } from 'types/enums'
import { tickAsync } from 'utils/sleep'
import { PaymentConfirmationDialog } from './PaymentConfirmationDialog'

it("doesn't submit an empty form", async () => {
  const onClose = jest.fn()
  const onSubmit = jest.fn()
  const wrapper = mount(
    <PaymentConfirmationDialog
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
      .find(PaymentConfirmationDialog)
      .find('button[type="submit"]')
      .prop('disabled'),
  ).toBe(true)

  await act(async () => {
    wrapper.find('form').simulate('submit')
    await tickAsync()
  })

  expect(onClose).not.toHaveBeenCalled()
  expect(onSubmit).not.toHaveBeenCalled()
})

it("doesn't submit an invalid form", async () => {
  const onClose = jest.fn()
  const onSubmit = jest.fn()
  const wrapper = mount(
    <PaymentConfirmationDialog
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
    wrapper.find('form').simulate('submit')
    await tickAsync()
  })

  expect(onClose).not.toHaveBeenCalled()
  expect(onSubmit).not.toHaveBeenCalled()
})

it('submits a valid form', async () => {
  const onClose = jest.fn()
  const onSubmit = jest.fn()
  const wrapper = mount(
    <PaymentConfirmationDialog
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
      .simulate('change', { target: { value: '100' } })
    await tickAsync()
  })

  wrapper.update()

  expect(wrapper.find('button[type="submit"]').prop('disabled')).not.toBe(true)

  await act(async () => {
    wrapper.find('form').simulate('submit')
    await tickAsync()
  })

  expect(onClose).toHaveBeenCalled()
  expect(onSubmit).toHaveBeenCalled()
})
