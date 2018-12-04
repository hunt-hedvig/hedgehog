import { ScrollList } from 'components/shared'
import { getFieldName } from 'lib/helpers'
import * as React from 'react'
import { List } from 'semantic-ui-react'
import styled from 'styled-components'

const TextWrapper = styled('div')(
  ({ width = '200px' }: { width?: string }) => ({
    wordWrap: 'break-word',
    width,
    fontSize: '80%',
  }),
)

const InsuranceTrace = ({ traceData }) =>
  !traceData || traceData.length === 0 ? null : (
    <>
      <h4>List of changes</h4>
      <ScrollList selection>
        {traceData.map((trace) => (
          <List.Item key={trace.fieldName + trace.date + trace.userId}>
            <List.Content floated="left">
              <TextWrapper width={'300px'}>
                {trace.date}. {getFieldName(trace.fieldName)}. {trace.userId}
              </TextWrapper>
            </List.Content>
            <List.Content floated="right">
              <TextWrapper width={'300px'}>{trace.newValue}</TextWrapper>
            </List.Content>
          </List.Item>
        ))}
      </ScrollList>
    </>
  )

export default InsuranceTrace
