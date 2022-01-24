import React from 'react'
import { useAvailableEmployeeRolesQuery } from 'types/generated/graphql'
import {
  CreateEmployee,
  Row,
  StyledDropdown,
  StyledInput,
} from './CreateEmployee'

export const EmployeeFilter: React.FC<{
  scopes: string[]
  filter: { email: string; role: string; label: string }
  setFilter: React.Dispatch<
    React.SetStateAction<{ email: string; role: string; label: string }>
  >
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
      <Row style={{ width: '50%' }}>
        <StyledInput
          style={{ flex: 1 }}
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
          onChange={(option) =>
            option?.value &&
            option?.label &&
            setFilter({
              ...filter,
              role: option.value as string,
              label: option.label as string,
            })
          }
          isClearable
          placeholder="Filter role"
        />
      </Row>
      <CreateEmployee scopes={scopes} />
    </Row>
  )
}
