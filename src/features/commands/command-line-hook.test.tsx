import { Keys } from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { mount } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { CommandLineProvider, useCommandLine } from './command-line-hook'

describe('CommandLineProvider', () => {
  const simulateOpenKeyPress = () => {
    act(() => {
      window.dispatchEvent(
        // Using the recommended "key" attribute doesn't trigger the event, but "keyCode" does
        // @ts-ignore
        new KeyboardEvent('keydown', { key: Keys.Option.code }),
      )
    })

    act(() => {
      window.dispatchEvent(
        // Using the recommended "key" attribute doesn't trigger the event, but "keyCode" does
        // @ts-ignore
        new KeyboardEvent('keydown', { key: Keys.Space.code }),
      )
    })
  }

  it('hints on option press', () => {
    const CommandLineConsumer: React.FC = () => {
      const { isHintingOption } = useCommandLine()

      return <>{isHintingOption ? 'hint' : 'no hint'}</>
    }

    const wrapper = mount(
      <CommandLineProvider>
        <CommandLineConsumer />
      </CommandLineProvider>,
    )

    act(() => {
      window.dispatchEvent(
        // Using the recommended "key" attribute doesn't trigger the event, but "keyCode" does
        // @ts-ignore
        new KeyboardEvent('keydown', { key: Keys.Option.code }),
      )
    })

    wrapper.update()

    expect(wrapper.text()).toStrictEqual('hint')
  })

  it('opens on option+space press', () => {
    const wrapper = mount(<CommandLineProvider />)

    simulateOpenKeyPress()

    wrapper.update()

    expect(wrapper.find('CommandLineComponent').exists()).toBe(true)
  })

  it('closes on escape press', () => {
    const wrapper = mount(<CommandLineProvider />)

    simulateOpenKeyPress()

    wrapper.update()

    expect(wrapper.find('CommandLineComponent').exists()).toBe(true)

    act(() => {
      window.dispatchEvent(
        // Using the recommended "key" attribute doesn't trigger the event, but "keyCode" does
        // @ts-ignore
        new KeyboardEvent('keydown', { key: Keys.Escape.code }),
      )
    })

    wrapper.update()

    expect(wrapper.find('CommandLineComponent').exists()).toBe(false)
  })

  it('closes on mouse click', () => {
    const wrapper = mount(<CommandLineProvider />)
    simulateOpenKeyPress()
    wrapper.update()
    expect(wrapper.find('CommandLineComponent').exists()).toBe(true)

    const nonCLIElement = document.createElement('div')
    document.body.appendChild(nonCLIElement)
    act(() => {
      document.dispatchEvent(new KeyboardEvent('mousedown'))
    })

    wrapper.update()

    expect(wrapper.find('CommandLineComponent').exists()).toBe(false)
  })
})
