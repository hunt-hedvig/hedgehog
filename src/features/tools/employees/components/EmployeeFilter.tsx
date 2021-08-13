import styled from '@emotion/styled'
import { Role } from 'api/generated/graphql'
import { CreateEmployee } from 'features/tools/employees/components/CreateEmployee'
import { Row } from 'features/tools/employees/utils'
import { SearchableDropdown } from 'hedvig-ui/searchable-dropdown'
import React from 'react'
import { Checkbox, Input } from 'semantic-ui-react'

const StyledDropdown = styled(SearchableDropdown)`
  width: 12em;
  padding: 0 1em;
`

export const EmployeeFilter: React.FC<{
  filter: { email; role; showDeleted }
  setFilter: React.Dispatch<React.SetStateAction<{ email; role; showDeleted }>>
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
        <Checkbox
          checked={filter.showDeleted}
          label={<label>{'Show deleted'}</label>}
          onChange={(_, { checked }) =>
            setFilter({
              ...filter,
              showDeleted: checked,
            })
          }
        />
      </Row>
      <CreateEmployee />
    </Row>
  )
}
