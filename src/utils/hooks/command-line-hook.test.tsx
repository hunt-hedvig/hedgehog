import { mount } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { KeyCode } from 'utils/hooks/key-press-hook'
import { CommandLineProvider, useCommandLine } from './command-line-hook'

describe('CommandLineProvider', () => {
  const simulateOpenKeyPress = () => {
    act(() => {
      window.dispatchEvent(
        // Using the recommended "key" attribute doesn't trigger the event, but "keyCode" does
        // @ts-ignore
        new KeyboardEvent('keydown', { keyCode: KeyCode.Option }),
      )
    })

    act(() => {
      window.dispatchEvent(
        // Using the recommended "key" attribute doesn't trigger the event, but "keyCode" does
        // @ts-ignore
        new KeyboardEvent('keydown', { keyCode: KeyCode.Space }),
      )
    })
  }

  it('hints on option press', () => {
    const CommandLineConsumer: React.FC = () => {
      const { isHinting } = useCommandLine()

      return <>{isHinting ? 'hint' : 'no hint'}</>
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
        new KeyboardEvent('keydown', { keyCode: KeyCode.Option }),
      )
    })

    wrapper.update()

    expect(wrapper.text()).toStrictEqual('hint')
  })

  it('opens on option+space press', () => {
    const wrapper = mount(<CommandLineProvider />)

    simulateOpenKeyPress()

    wrapper.update()

    expect(wrapper.find('CommandLineComponent').exists()).toBeTruthy()
  })

  it('closes on escape press', () => {
    const wrapper = mount(<CommandLineProvider />)

    simulateOpenKeyPress()

    wrapper.update()

    expect(wrapper.find('CommandLineComponent').exists()).toBeTruthy()

    act(() => {
      window.dispatchEvent(
        // Using the recommended "key" attribute doesn't trigger the event, but "keyCode" does
        // @ts-ignore
        new KeyboardEvent('keydown', { keyCode: KeyCode.Escape }),
      )
    })

    wrapper.update()

    expect(wrapper.find('CommandLineComponent').exists()).toBeFalsy()
  })

  it('closes on mouse click', () => {
    const wrapper = mount(<CommandLineProvider />)
    simulateOpenKeyPress()
    wrapper.update()
    expect(wrapper.find('CommandLineComponent').exists()).toBeTruthy()

    act(() => {
      window.dispatchEvent(new KeyboardEvent('mousedown'))
    })

    wrapper.update()

    expect(wrapper.find('CommandLineComponent').exists()).toBeFalsy()
  })
})
