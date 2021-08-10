import styled from '@emotion/styled'
import {
  ListEmployeesDocument,
  Role,
  useListEmployeesQuery,
  useRemoveEmployeeMutation,
  useUpdateEmployeeRoleMutation,
} from 'api/generated/graphql'
import { Button, ButtonsGroup } from 'hedvig-ui/button'
import { Card } from 'hedvig-ui/card'
import { dateTimeFormatter } from 'lib/helpers'
import React, { useState } from 'react'
import { Dropdown, DropdownItemProps, Table } from 'semantic-ui-react'

const StyledDropdown = styled(Dropdown)({
  width: '100%',
})

export const EmployeeTable: React.FC = () => {
  const employees = useListEmployeesQuery()

  const [updateRole] = useUpdateEmployeeRoleMutation({
    refetchQueries: () => [{ query: ListEmployeesDocument }],
  })

  const [removeEmployee] = useRemoveEmployeeMutation({
    refetchQueries: () => [{ query: ListEmployeesDocument }],
  })

  const dropdownOptions: DropdownItemProps[] = Object.values(Role).map(
    (value, index) => {
      return {
        key: index + 1,
        value: value as string,
        text: (value as string).replace('_', ' '),
      }
    },
  )

  const currentRoles =
    employees.data?.listEmployees.reduce((acc, curr) => {
      acc[curr.id] = curr.role
      return acc
    }, {}) ?? {}

  const [selectedRoles, setSelectedRoles] = useState(currentRoles)

  return (
    <>
      {(employees.loading && <Card span={1}>Loading employees...</Card>) ||
        (employees.data?.listEmployees.length === 0 && (
          <Card span={1}>No employees exist in the database</Card>
        )) ||
        (employees.data?.listEmployees.length !== 0 && (
          <Card span={1}>
            <Table celled style={{ fontSize: '1.0rem', overflow: 'visible' }}>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Email</Table.HeaderCell>
                  <Table.HeaderCell>Role</Table.HeaderCell>
                  <Table.HeaderCell>First granted at</Table.HeaderCell>
                  <Table.HeaderCell>Removed at</Table.HeaderCell>
                  <Table.HeaderCell>Actions</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <>
                  {employees.data?.listEmployees.map((employee) => {
                    const {
                      id,
                      email,
                      role,
                      firstGrantedAt,
                      deletedAt,
                    } = employee

                    return (
                      <Table.Row key={id}>
                        <Table.Cell>{email}</Table.Cell>
                        <Table.Cell>
                          <StyledDropdown
                            options={dropdownOptions}
                            onChange={(_, { value }) =>
                              setSelectedRoles({
                                ...selectedRoles,
                                [id]: value,
                              })
                            }
                            placeholder={role}
                            selection
                            defaultValue={role}
                          />
                        </Table.Cell>
                        <Table.Cell>
                          {dateTimeFormatter(
                            firstGrantedAt,
                            'yyyy-MM-dd HH:mm:ss',
                          )}
                        </Table.Cell>
                        <Table.Cell>
                          {dateTimeFormatter(deletedAt, 'yyyy-MM-dd HH:mm:ss')}
                        </Table.Cell>
                        <Table.Cell width={1}>
                          <ButtonsGroup>
                            <Button
                              variation={'primary'}
                              disabled={!selectedRoles?.[id]}
                              onClick={() =>
                                updateRole({
                                  variables: {
                                    employeeEmail: email,
                                    role: selectedRoles?.[id],
                                  },
                                })
                              }
                            >
                              Update Role
                            </Button>
                            <Button
                              variation={'danger'}
                              onClick={() =>
                                removeEmployee({
                                  variables: { employeeEmail: email },
                                })
                              }
                            >
                              Remove
                            </Button>
                          </ButtonsGroup>
                        </Table.Cell>
                      </Table.Row>
                    )
                  })}
                </>
              </Table.Body>
            </Table>
          </Card>
        ))}
    </>
  )
}
