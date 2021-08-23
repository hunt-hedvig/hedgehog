import {
  Employee,
  EmployeesDocument,
  useAvailableEmployeeRolesQuery,
  useEmployeesQuery,
  useRemoveEmployeeMutation,
  useUpdateEmployeeRoleMutation,
} from 'api/generated/graphql'
import {
  LoadingMessage,
  StandaloneMessage,
} from 'hedvig-ui/animations/standalone-message'
import { Button, ButtonsGroup } from 'hedvig-ui/button'
import { Card } from 'hedvig-ui/card'
import { Dropdown } from 'hedvig-ui/dropdown'
import { dateTimeFormatter } from 'lib/helpers'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { Table } from 'semantic-ui-react'

export const EmployeeTable: React.FC<{
  scopes: readonly string[]
  filter: { email: string; role: string }
}> = ({ scopes, filter }) => {
  const { data, loading } = useEmployeesQuery()
  const employees = data?.employees ?? []

  const [
    updateRole,
    { loading: updateRoleLoading },
  ] = useUpdateEmployeeRoleMutation()

  const [
    removeEmployee,
    { loading: removeEmployeeLoading },
  ] = useRemoveEmployeeMutation({
    refetchQueries: () => [{ query: EmployeesDocument }],
  })

  const availableRoles = useAvailableEmployeeRolesQuery()

  const options =
    availableRoles.data?.availableEmployeeRoles.map((value, index) => {
      return {
        key: index + 1,
        value,
        text: (value as string).replace('_', ' '),
      }
    }) ?? []

  const currentRoles =
    employees.reduce((acc, curr) => {
      acc[curr.id] = curr.role
      return acc
    }, {}) ?? {}

  const [selectedRoles, setSelectedRoles] = useState({})

  const filterEmployee = (employee: Employee) => {
    return (
      employee.email.includes(filter.email) &&
      (!filter.role || filter.role === employee.role)
    )
  }

  if (loading) {
    return <LoadingMessage paddingTop={'25vh'} />
  }
  if (employees.length === 0) {
    return (
      <StandaloneMessage paddingTop="25vh">
        No employees exist in the database
      </StandaloneMessage>
    )
  }
  return (
    <Card span={1}>
      <Table celled style={{ fontSize: '1.0rem', overflow: 'visible' }}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Role</Table.HeaderCell>
            <Table.HeaderCell>First granted at</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <>
            {employees.filter(filterEmployee).map((employee) => {
              const { id, email, role, firstGrantedAt } = employee

              return (
                <Table.Row key={id}>
                  <Table.Cell width={5}>{email}</Table.Cell>
                  <Table.Cell width={3}>
                    {scopes.includes('employees:manage') ? (
                      <Dropdown
                        options={options}
                        onChange={(value) =>
                          setSelectedRoles({
                            ...selectedRoles,
                            [id]: value,
                          })
                        }
                        selection
                        value={selectedRoles[id] ?? role}
                      />
                    ) : (
                      role
                    )}
                  </Table.Cell>
                  <Table.Cell width={3}>
                    {dateTimeFormatter(firstGrantedAt, 'yyyy-MM-dd HH:mm')}
                  </Table.Cell>
                  <Table.Cell width={1}>
                    <ButtonsGroup>
                      <Button
                        variation={'primary'}
                        disabled={
                          !selectedRoles[id] ||
                          selectedRoles[id] === currentRoles[id] ||
                          updateRoleLoading
                        }
                        onClick={() =>
                          toast.promise(
                            updateRole({
                              variables: {
                                id,
                                role: selectedRoles[id],
                              },
                            }),
                            {
                              loading: 'Updating role',
                              success: 'Role updated',
                              error: 'Could not update role',
                            },
                          )
                        }
                      >
                        Update Role
                      </Button>
                      <Button
                        variation={'danger'}
                        disabled={
                          removeEmployeeLoading ||
                          !scopes.includes('employees:manage')
                        }
                        onClick={() => {
                          const confirmed = window.confirm(
                            `Are you sure you want to remove employee ${email}?`,
                          )
                          if (confirmed) {
                            toast.promise(
                              removeEmployee({
                                variables: { id },
                              }),
                              {
                                loading: 'Removing employee',
                                success: 'Employee removed',
                                error: 'Could not remove employee',
                              },
                            )
                          }
                        }}
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
  )
}
