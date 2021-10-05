import { EnumDropdown } from '@hedvig-ui'
import React from 'react'
import {
  Dropdown as DropdownNoSemantic,
  MultiDropdown,
  Option,
} from './dropdown'

export default {
  title: 'EnumDropdown',
  component: EnumDropdown,
  decorators: [],
}

enum Taste {
  Sweet = 'SWEET',
  Sour = 'SOUR',
  TheHedvigFavorite = 'THE_HEDVIG_FAVORITE',
}

export const DropdownWithEnum: React.FC = () => {
  const [taste, setTaste] = React.useState<Taste | null>(null)
  return (
    <>
      <EnumDropdown
        enumToSelectFrom={Taste}
        placeholder="Select a taste"
        onChange={setTaste}
      />
      <h3>
        <strong>Selected taste:</strong>
        {taste}
      </h3>
    </>
  )
}

export const DropdownWithoutSemantic = () => {
  const [selected, setSelected] = React.useState<number>()

  const OPTIONS = [
    'Option №1',
    <button tabIndex={-1}>Option №2</button>,
    'Option №3',
    'Option №4',
    'Option №5',
    'Option №6',
    'Option №7',
  ]

  return (
    <div style={{ padding: 50 }}>
      <DropdownNoSemantic title="Dropdown">
        {OPTIONS.map((opt, index) => (
          <Option
            key={index}
            selected={selected === index}
            onClick={() => setSelected(index)}
          >
            {opt}
          </Option>
        ))}
      </DropdownNoSemantic>
    </div>
  )
}

export const DropdownMulti = () => {
  const [selected, setSelected] = React.useState<string[]>([])

  const OPTIONS = [
    'Option №1',
    'Option №2',
    'Option №3',
    'Option №4',
    'Option №5',
    'Option №6',
    'Option №7',
  ]

  const selectHandler = (opt: string) => {
    if (selected?.includes(opt)) {
      setSelected((prev) => prev?.filter((el) => el !== opt))
    } else {
      setSelected((prev) => [...prev, opt])
    }
  }

  return (
    <div style={{ padding: 50 }}>
      <MultiDropdown
        title="Dropdown"
        options={OPTIONS}
        selected={selected}
        selectHandler={selectHandler}
      />
    </div>
  )
}
