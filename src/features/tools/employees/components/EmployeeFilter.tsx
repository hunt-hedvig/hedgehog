import styled from '@emotion/styled'
import { useAvailableEmployeeRolesQuery } from 'api/generated/graphql'
import { CreateEmployee } from 'features/tools/employees/components/CreateEmployee'
import { Row } from 'features/tools/employees/utils'
import { SearchableDropdown } from 'hedvig-ui/searchable-dropdown'
import React from 'react'
import { Input } from 'semantic-ui-react'

const StyledDropdown = styled(SearchableDropdown)`
  width: 12em;
  padding: 0 1em;
`

export const EmployeeFilter: React.FC<{
  scopes: readonly string[]
  filter: { email: string; role: string }
  setFilter: React.Dispatch<React.SetStateAction<{ email; role }>>
}> = ({ scopes, filter, setFilter }) => {
  const roles = useAvailableEmployeeRolesQuery()

  const options =
    roles.data?.availableEmployeeRoles.map((value, index) => {
      return {
        key: index + 1,
        value,
        label: (value as string).replace('_', ' '),
      }
    }) ?? []

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
      </Row>
      <CreateEmployee scopes={scopes} />
    </Row>
  )
}
