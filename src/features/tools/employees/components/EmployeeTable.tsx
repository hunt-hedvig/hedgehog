import {
  ListEmployeesDocument,
  useListEmployeesQuery,
  useRemoveEmployeeMutation,
  useUpdateEmployeeRoleMutation,
} from 'api/generated/graphql'
import { dropdownOptions } from 'features/tools/employees/utils'
import { Button, ButtonsGroup } from 'hedvig-ui/button'
import { Card } from 'hedvig-ui/card'
import { Dropdown } from 'hedvig-ui/dropdown'
import { dateTimeFormatter } from 'lib/helpers'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { Table } from 'semantic-ui-react'

export const EmployeeTable: React.FC<{
  filter: { email; role; showDeleted }
}> = ({ filter }) => {
  const employees = useListEmployeesQuery()

  const [
    updateRole,
    { loading: updateRoleLoading },
  ] = useUpdateEmployeeRoleMutation({
    refetchQueries: () => [{ query: ListEmployeesDocument }],
  })

  const [
    removeEmployee,
    { loading: removeEmployeeLoading },
  ] = useRemoveEmployeeMutation({
    refetchQueries: () => [{ query: ListEmployeesDocument }],
  })

  const currentRoles =
    employees.data?.listEmployees.reduce((acc, curr) => {
      acc[curr.id] = curr.role
      return acc
    }, {}) ?? {}

  const [selectedRoles, setSelectedRoles] = useState({})

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

                    if (
                      (filter.role && role !== filter.role) ||
                      !email.includes(filter.email) ||
                      (deletedAt && !filter.showDeleted)
                    ) {
                      return
                    }

                    return (
                      <Table.Row key={id}>
                        <Table.Cell width={5}>{email}</Table.Cell>
                        <Table.Cell width={3}>
                          {!deletedAt ? (
                            <Dropdown
                              options={dropdownOptions}
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
                          {dateTimeFormatter(
                            firstGrantedAt,
                            'yyyy-MM-dd HH:mm',
                          )}
                        </Table.Cell>
                        <Table.Cell width={3}>
                          {dateTimeFormatter(deletedAt, 'yyyy-MM-dd HH:mm')}
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
                                      email,
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
                              disabled={removeEmployeeLoading || deletedAt}
                              onClick={() => {
                                const confirmed = window.confirm(
                                  `Are you sure you want to remove employee ${email}?`,
                                )
                                if (confirmed) {
                                  toast.promise(
                                    removeEmployee({
                                      variables: { email },
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
        ))}
    </>
  )
}
