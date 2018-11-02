import { getFieldName } from 'lib/helpers'
import * as React from 'react'
import { Table } from 'semantic-ui-react'

const InsuranceTrace = ({traceData}) => {
  if (!traceData || traceData.length === 0) return ''
  return (
  <React.Fragment>
    <h4>List of changes</h4>
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell width={1}>Field</Table.HeaderCell>
          <Table.HeaderCell width={1}>Date of change</Table.HeaderCell>
          <Table.HeaderCell width={1}>Old value</Table.HeaderCell>
          <Table.HeaderCell width={1}>New value</Table.HeaderCell>
          <Table.HeaderCell width={1}>Author</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <TraceTableBody traceData={traceData} />
    </Table>
  </React.Fragment>)}

const TraceTableBody = ({traceData}) => traceData.map ((trace) =>
  <React.Fragment>
    <Table.Row key={trace.id}>
      <Table.Cell>{getFieldName(trace.fieldName)}</Table.Cell>
      <Table.Cell>{trace.date}</Table.Cell>
      <Table.Cell>{trace.oldValue}</Table.Cell>
      <Table.Cell>{trace.newValue}</Table.Cell>
      <Table.Cell>{trace.userId}</Table.Cell>
    </Table.Row>
  </React.Fragment>)

export default InsuranceTrace
