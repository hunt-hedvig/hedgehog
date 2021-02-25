import { mount } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { KeyCode } from 'utils/hooks/key-press-hook'
import { CommandLineProvider, useCommandLine } from './command-line-hook'

describe('CommandLineProvider', () => {
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
})
