import { useListEmployees } from 'graphql/use-list-employees'
import { Card } from 'hedvig-ui/card'
import React from 'react'
import { Table } from 'semantic-ui-react'

export const EmployeeTable: React.FC = () => {
  const [Employees, { loading }] = useListEmployees()

  if (loading) {
    return <Card span={1}>Loading employees...</Card>
  }

  if (Employees.length === 0) {
    return <Card span={1}>No employees exist in the database</Card>
  }

  return (
    <Card span={1}>
      <Table celled style={{ fontSize: '1.0rem' }}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="left">YOLO</Table.HeaderCell>
            <Table.HeaderCell>Role</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>First granted at</Table.HeaderCell>
            <Table.HeaderCell>Removed at</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <>
            {Employees.map((employee) => {
              const { id, email, role, firstGrantedAt, deletedAt } = employee

              return (
                <Table.Row key={id}>
                  <Table.Cell>{email}</Table.Cell>
                  <Table.Cell>{role}</Table.Cell>
                  <Table.Cell width={3}>{firstGrantedAt}</Table.Cell>
                  <Table.Cell width={3}>{deletedAt}</Table.Cell>
                </Table.Row>
              )
            })}
          </>
        </Table.Body>
      </Table>
    </Card>
  )
}
