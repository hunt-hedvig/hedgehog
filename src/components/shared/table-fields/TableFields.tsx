import { getFieldName, getFieldValue } from 'lib/helpers'
import React from 'react'
import { Table } from 'semantic-ui-react'

interface TableFieldsProps<T> {
  fields: T
  fieldFormatters?: { [P in keyof T]?: (val: T[P]) => React.ReactNode }
}

const TableFields = <T extends {}>(props: TableFieldsProps<T>) => {
  const { fields, fieldFormatters } = props
  return (
    <React.Fragment>
      {(Object.keys(fields) as Array<keyof T>).map((field, id) => {
        const formatter = fieldFormatters && fieldFormatters[field]
        return (
          <Table.Row key={id}>
            <Table.Cell>{getFieldName(field)}</Table.Cell>
            <Table.Cell>
              {formatter
                ? formatter(fields[field])
                : getFieldValue(fields[field])}
            </Table.Cell>
          </Table.Row>
        )
      })}
    </React.Fragment>
  )
}

export default TableFields
