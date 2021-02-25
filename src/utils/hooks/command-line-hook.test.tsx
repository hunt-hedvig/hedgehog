import { mount } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { KeyCode } from 'utils/hooks/key-press-hook'
import {
  CommandLineComponent,
  CommandLineProvider,
  useCommandLine,
} from './command-line-hook'

describe('CommandLineProvider', () => {
  const simulateOpenKeyPress = () => {
    act(() => {
      window.dispatchEvent(
        // @ts-ignore
        new KeyboardEvent('keydown', { keyCode: KeyCode.Option }),
      )
    })

    act(() => {
      window.dispatchEvent(
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
        // @ts-ignore
        new KeyboardEvent('keydown', { keyCode: KeyCode.Option }),
      )
    })

    wrapper.update()

    expect(wrapper.text()).toEqual('hint')
  })

  it('opens on option+space press', () => {
    const wrapper = mount(<CommandLineProvider />)

    simulateOpenKeyPress()

    wrapper.update()

    expect(wrapper.children().find(CommandLineComponent).length).toEqual(1)
  })

  it('closes on escape press', () => {
    const wrapper = mount(<CommandLineProvider />)

    simulateOpenKeyPress()

    wrapper.update()

    expect(wrapper.children().find(CommandLineComponent).length).toEqual(1)

    act(() => {
      window.dispatchEvent(
        // @ts-ignore
        new KeyboardEvent('keydown', { keyCode: KeyCode.Escape }),
      )
    })

    wrapper.update()

    expect(wrapper.children().find(CommandLineComponent).length).toEqual(0)
  })

  it('closes on mouse click', () => {
    const wrapper = mount(<CommandLineProvider />)
    simulateOpenKeyPress()
    wrapper.update()
    expect(wrapper.children().find(CommandLineComponent).length).toEqual(1)

    act(() => {
      window.dispatchEvent(
        // @ts-ignore
        new KeyboardEvent('mousedown'),
      )
    })

    wrapper.update()

    expect(wrapper.children().find(CommandLineComponent).length).toEqual(0)
  })
})
