import styled from '@emotion/styled'
import { Role } from 'api/generated/graphql'
import { CreateEmployee } from 'features/tools/employees/components/CreateEmployee'
import { Row } from 'features/tools/employees/utils'
import { SearchableDropdown } from 'hedvig-ui/searchable-dropdown'
import React from 'react'
import { Input } from 'semantic-ui-react'

const StyledDropdown = styled(SearchableDropdown)`
  width: 12em;
`

export const EmployeeFilter: React.FC<{
  filter: { email; role }
  setFilter: React.Dispatch<React.SetStateAction<{ email; role }>>
}> = ({ filter, setFilter }) => {
  const options = Object.values(Role).map((value) => {
    return {
      value,
      label: (value as string).replace('_', ' '),
    }
  })

  return (
    <Row style={{ width: '100%' }}>
      <Row style={{ justifyContent: 'start' }}>
        <Input
          value={filter.email ?? ''}
          onChange={({ currentTarget: { value } }) => {
            setFilter({
              ...filter,
              email: value,
            })
          }}
          placeholder="Filter email"
          style={{ paddingRight: '1em' }}
        />
        <StyledDropdown
          options={options}
          value={
            filter.role ? { value: filter.role, label: filter.role } : null
          }
          onChange={(data) =>
            setFilter({
              ...filter,
              role: data?.value,
            })
          }
          isClearable
          isSearchable={false}
          placeholder={'Filter role'}
        />
      </Row>
      <CreateEmployee />
    </Row>
  )
}
