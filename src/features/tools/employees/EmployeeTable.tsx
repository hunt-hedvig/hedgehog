import { Role, useListEmployeesQuery } from 'api/generated/graphql'
import { Button, ButtonsGroup } from 'hedvig-ui/button'
import { Card } from 'hedvig-ui/card'
import { EnumDropdown } from 'hedvig-ui/dropdown'
import { dateTimeFormatter } from 'lib/helpers'
import React, { useState } from 'react'
import { Table } from 'semantic-ui-react'

export const EmployeeTable: React.FC = () => {
  const employees = useListEmployeesQuery()

  const [updatingId, setUpdatingId] = useState(null)

  return (
    <>
      {(employees.loading && <Card span={1}>Loading employees...</Card>) ||
        (employees.data?.listEmployees.length === 0 && (
          <Card span={1}>No employees exist in the database</Card>
        )) ||
        (employees.data?.listEmployees.length !== 0 && (
          <Card span={1}>
            <Table celled style={{ fontSize: '1.0rem' }}>
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
                          <EnumDropdown
                            setValue={() => role}
                            placeholder={role}
                            enumToSelectFrom={Role}
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
                        <Table.Cell width={2}>
                          <ButtonsGroup>
                            <Button>Update</Button>
                            <Button variation={'danger'}>Remove</Button>
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
