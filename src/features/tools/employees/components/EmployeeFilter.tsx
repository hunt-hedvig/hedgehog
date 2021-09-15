import styled from '@emotion/styled'
import { SearchableDropdown } from '@hedvig-ui'
import React from 'react'
import { Input } from 'semantic-ui-react'
import { useAvailableEmployeeRolesQuery } from 'types/generated/graphql'
import { CreateEmployee, Row } from './CreateEmployee'

const StyledDropdown = styled(SearchableDropdown)`
  width: 12em;
  padding: 0 1em;
`

export const EmployeeFilter: React.FC<{
  scopes: string[]
  filter: { email: string; role: string; label: string }
  setFilter: React.Dispatch<React.SetStateAction<{ email; role; label }>>
}> = ({ scopes, filter, setFilter }) => {
  const { data } = useAvailableEmployeeRolesQuery()
  const roles = data?.availableEmployeeRoles ?? []

  const options =
    roles.map((value, index) => {
      return {
        key: index + 1,
        value,
        label: (value as string).replace('_', ' '),
      }
    }) ?? []

  return (
    <Row style={{ width: '100%' }}>
      <Row style={{ justifyContent: 'flex-start' }}>
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
            filter.role ? { value: filter.role, label: filter.label } : null
          }
          onChange={(val) =>
            setFilter({
              ...filter,
              role: val?.value,
              label: val?.label,
            })
          }
          isClearable
          isSearchable={false}
          placeholder="Filter role"
        />
      </Row>
      <CreateEmployee scopes={scopes} />
    </Row>
  )
}
