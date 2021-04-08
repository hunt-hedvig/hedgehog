import { ScrollList } from 'components/shared'
import { getFieldName } from 'lib/helpers'
import * as React from 'react'
import styled from '@emotion/styled'
import { List } from 'semantic-ui-react'

const TextWrapper = styled('div')(
  ({ width = '200px' }: { width?: string }) => ({
    wordWrap: 'break-word',
    width,
    fontSize: '90%',
  }),
)

const FieldWrapper = styled('span')({
  fontWeight: 'bold',
  color: '#888888',
})

const InsuranceTrace = ({ traceData }) =>
  !traceData || traceData.length === 0 ? null : (
    <>
      <h4>List of changes</h4>
      <ScrollList selection>
        {[...traceData].reverse().map((trace) => (
          <List.Item key={trace.fieldName + trace.date + trace.userId}>
            <List.Content floated="left">
              <TextWrapper width={'100%'}>
                <FieldWrapper>{getFieldName(trace.fieldName)}</FieldWrapper>{' '}
                changed on <FieldWrapper>{trace.date}</FieldWrapper> by{' '}
                <FieldWrapper>{trace.userId}</FieldWrapper>. The new value is{' '}
                <FieldWrapper>{trace.newValue}</FieldWrapper>
              </TextWrapper>
            </List.Content>
          </List.Item>
        ))}
      </ScrollList>
    </>
  )

export default InsuranceTrace
