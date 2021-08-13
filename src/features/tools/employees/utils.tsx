import styled from '@emotion/styled'
import { Role } from 'api/generated/graphql'
import { DropdownOption } from 'features/tools/campaign-codes/components/ClearableDropdown'

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

export const dropdownOptions: DropdownOption[] = Object.values(Role).map(
  (value, index) => {
    return {
      key: index + 1,
      value,
      text: (value as string).replace('_', ' '),
    }
  },
)
