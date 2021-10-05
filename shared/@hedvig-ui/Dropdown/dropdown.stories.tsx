import {
  Button,
  EnumDropdown,
  Spinner,
  Table,
  TableColumn,
  TableHeader,
  TableHeaderColumn,
  TableRow,
} from '@hedvig-ui'
import React from 'react'
import { Dropdown as DropdownNoSemantic, Option } from './dropdown2'

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
    <div style={{ display: 'flex', gap: 15 }}>
      <Button tabIndex={-1}>Option #1</Button>
      <Button tabIndex={-1}>Option #1</Button>
      <Button tabIndex={-1}>Option #1</Button>
      <Button tabIndex={-1}>Option #1</Button>
    </div>,
    <Table>
      <TableHeader>
        <TableHeaderColumn>Option #2</TableHeaderColumn>
      </TableHeader>

      <TableRow>
        <TableColumn>{21}</TableColumn>
        <TableColumn>{23}</TableColumn>
        <TableColumn>{24}</TableColumn>
        <TableColumn>{25}</TableColumn>
      </TableRow>
    </Table>,
    <div style={{ display: 'flex', gap: 15 }}>
      <Spinner />
      <Spinner />
      <Spinner />
      <Spinner />
      <Spinner />
      <Spinner />
    </div>,
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
