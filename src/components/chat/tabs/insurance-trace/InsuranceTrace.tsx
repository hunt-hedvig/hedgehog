import { getFieldName } from 'lib/helpers'
import * as React from 'react'
import { Table } from 'semantic-ui-react'
import styled from 'styled-components'

const TextWrapper = styled('div')(
  (
    { width = '200px' }: { width?: string },
  ) => ({
    wordWrap: 'break-word',
    width,
    fontSize: '80%',
  }),
)

const InsuranceTrace = ({ traceData }) =>
  !traceData || traceData.length === 0 ? null : (
    <>
      <h4>List of changes</h4>
      <Table celled compact={'very'}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={1}>Date, field, author</Table.HeaderCell>
            <Table.HeaderCell width={1}>New value</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {traceData.map((trace) => (
            <Table.Row key={trace.id}>
              <Table.Cell>
                <TextWrapper width={'300px'}>
                  {trace.date}. {getFieldName(trace.fieldName)}. {trace.userId}
                </TextWrapper>
              </Table.Cell>
              <Table.Cell>
                <TextWrapper width={'300px'}>{trace.newValue}</TextWrapper>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  )

export default InsuranceTrace
