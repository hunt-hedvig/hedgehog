import { EnumDropdown } from 'hedvig-ui/dropdown'
import * as React from 'react'

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

export const DropdownWithEnum: React.FunctionComponent = () => {
  const [terminationReason, setTerminationReason] = React.useState(null)
  return (
    <>
      <EnumDropdown
        enumToSelectFrom={Taste}
        placeholder={'Select a taste'}
        setValue={setTerminationReason}
      />
      <h3>
        <b>{'Selected taste:'} </b>
        {terminationReason}
      </h3>
    </>
  )
}
