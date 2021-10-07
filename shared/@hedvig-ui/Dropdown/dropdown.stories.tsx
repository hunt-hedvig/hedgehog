import {
  Button,
  Card,
  Dropdown,
  DropdownOption,
  EnumDropdown,
  MultiDropdown,
} from '@hedvig-ui'
import React from 'react'
import {} from './dropdown'

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
    <Card>
      <Button>Option №5</Button>
    </Card>,
    'Option №6',
    'Option №7',
  ]

  return (
    <div style={{ padding: '50px 600px' }}>
      <Dropdown placeholder="Dropdown">
        {OPTIONS.map((opt, index) => (
          <DropdownOption
            key={index}
            selected={selected === index}
            onClick={() => setSelected(index)}
          >
            {opt}
          </DropdownOption>
        ))}
      </Dropdown>
    </div>
  )
}

export const DropdownMulti = () => {
  const [selected, setSelected] = React.useState<string[]>([])

  const OPTIONS = [
    'Option №1',
    'Opt №2',
    'Opti №3',
    'Option №4',
    'Option №5',
    'Optn №6',
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
    <div style={{ padding: '50px 600px' }}>
      <MultiDropdown
        value={selected}
        options={OPTIONS}
        placeholder="Dropdown"
        onChange={selectHandler}
        clearHandler={() => setSelected([])}
      />
      <div style={{ marginTop: 25 }}>{selected.join(', ')}</div>
    </div>
  )
}
