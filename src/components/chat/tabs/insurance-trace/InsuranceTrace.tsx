import { getFieldName } from 'lib/helpers'
import * as React from 'react'
import { Table } from 'semantic-ui-react'

const TextWrapper = ({ text, width }) => (
  <div style={{ wordWrap: 'break-word', width: width || '150px' }}>{text}</div>
)

const InsuranceTrace = ({ traceData }) =>
  !traceData || traceData.length === 0 ? null : (
    <>
      <h4>List of changes</h4>
      <Table celled compact={'very'}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={1}>Field</Table.HeaderCell>
            <Table.HeaderCell width={1}>Date of change</Table.HeaderCell>
            <Table.HeaderCell width={1}>Old value</Table.HeaderCell>
            <Table.HeaderCell width={1}>New value</Table.HeaderCell>
            <Table.HeaderCell width={1}>Author</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {traceData.map((trace) => (
            <Table.Row key={trace.id}>
              <Table.Cell>{getFieldName(trace.fieldName)}</Table.Cell>
              <Table.Cell>
                <TextWrapper text={trace.date} width={'70px'} />
              </Table.Cell>
              <Table.Cell>
                <TextWrapper text={trace.oldValue} />
              </Table.Cell>
              <Table.Cell>
                <TextWrapper text={trace.newValue} />
              </Table.Cell>
              <Table.Cell>
                <TextWrapper text={trace.userId} width={'100px'} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  )

export default InsuranceTrace
