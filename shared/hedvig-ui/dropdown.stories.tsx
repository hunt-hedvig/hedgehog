import { EnumDropdown } from 'hedvig-ui/dropdown'
import React from 'react'

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
        placeholder={'Select a taste'}
        setValue={setTaste}
      />
      <h3>
        <strong>Selected taste:</strong>
        {taste}
      </h3>
    </>
  )
}
