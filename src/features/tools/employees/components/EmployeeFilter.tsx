import { ClearableDropdown } from 'features/tools/campaign-codes/components/ClearableDropdown'
import { dropdownOptions } from 'features/tools/employees/utils'
import { InfoContainer } from 'hedvig-ui/info-row'
import { Spacing } from 'hedvig-ui/spacing'
import { ThirdLevelHeadline } from 'hedvig-ui/typography'
import React from 'react'
import { Input } from 'semantic-ui-react'

export const EmployeeFilter: React.FC<{
  filter: { email; role }
  setFilter: React.Dispatch<React.SetStateAction<{ email; role }>>
}> = ({ filter, setFilter }) => {
  return (
    <InfoContainer>
      <ThirdLevelHeadline>Filter employees</ThirdLevelHeadline>
      <Spacing top={'small'} />
      <Input
        value={filter.email ?? ''}
        onChange={({ currentTarget: { value } }) => {
          setFilter({
            ...filter,
            email: value,
          })
        }}
        placeholder="Email"
      />
      <Spacing top={'small'} />
      <ClearableDropdown
        options={dropdownOptions}
        value={filter.role}
        onChange={(_, { value }) =>
          setFilter({
            ...filter,
            role: value,
          })
        }
        onClear={() =>
          setFilter({
            ...filter,
            role: null,
          })
        }
        placeholder={'Set role'}
      />
      <Spacing top={'small'} />
    </InfoContainer>
  )
}
