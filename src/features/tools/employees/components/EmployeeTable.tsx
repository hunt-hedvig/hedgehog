import {
  Button,
  ButtonsGroup,
  Card,
  Dropdown,
  DropdownOption,
  LoadingMessage,
  StandaloneMessage,
  Table,
  TableColumn,
  TableHeader,
  TableHeaderColumn,
  TableRow,
} from '@hedvig-ui'
import { useConfirmDialog } from '@hedvig-ui/Modal/use-confirm-dialog'
import { dateTimeFormatter } from '@hedvig-ui/utils/date'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import {
  Employee,
  EmployeesDocument,
  useAvailableEmployeeRolesQuery,
  useEmployeesQuery,
  useRemoveEmployeeMutation,
  useUpdateEmployeeRoleMutation,
} from 'types/generated/graphql'

export const EmployeeTable: React.FC<{
  scopes: readonly string[]
  filter: { email: string; role: string }
}> = ({ scopes, filter }) => {
  const { data, loading } = useEmployeesQuery()
  const { confirm } = useConfirmDialog()

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
    return <LoadingMessage paddingTop="25vh" />
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
      <Table style={{ fontSize: '1.0rem', overflow: 'visible' }}>
        <TableHeader>
          <TableHeaderColumn>Email</TableHeaderColumn>
          <TableHeaderColumn>Role</TableHeaderColumn>
          <TableHeaderColumn>First granted at</TableHeaderColumn>
          <TableHeaderColumn>Actions</TableHeaderColumn>
        </TableHeader>
        <>
          {employees.filter(filterEmployee).map((employee) => {
            const { id, email, role, firstGrantedAt } = employee

            return (
              <TableRow key={id}>
                <TableColumn>{email}</TableColumn>
                <TableColumn>
                  {scopes.includes('employees:manage') ? (
                    <Dropdown placeholder={role}>
                      {options.map((opt) => {
                        return (
                          <DropdownOption
                            onClick={() => {
                              setSelectedRoles({
                                ...selectedRoles,
                                [id]: opt.value,
                              })
                            }}
                            selected={selectedRoles[id] === opt.value}
                          >
                            {opt.text || role}
                          </DropdownOption>
                        )
                      })}
                    </Dropdown>
                  ) : (
                    role
                  )}
                </TableColumn>
                <TableColumn>
                  {dateTimeFormatter(firstGrantedAt, 'yyyy-MM-dd HH:mm')}
                </TableColumn>
                <TableColumn>
                  <ButtonsGroup>
                    <Button
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
                      Update role
                    </Button>
                    <Button
                      variant="tertiary"
                      disabled={
                        removeEmployeeLoading ||
                        !scopes.includes('employees:manage')
                      }
                      onClick={() => {
                        confirm(
                          `Are you sure you want to remove employee ${email}?`,
                        ).then(() => {
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
                        })
                      }}
                    >
                      Remove
                    </Button>
                  </ButtonsGroup>
                </TableColumn>
              </TableRow>
            )
          })}
        </>
      </Table>
    </Card>
  )
}
