import { getFieldName, getFieldValue } from 'lib/helpers'
import * as PropTypes from 'prop-types'
import * as React from 'react'
import { Table } from 'semantic-ui-react'

const TableFields = ({ fields }) => (
  <React.Fragment>
    {Object.keys(fields).map((field, id) => (
      <Table.Row key={id}>
        <Table.Cell>{getFieldName(field)}</Table.Cell>
        <Table.Cell>{getFieldValue(fields[field])}</Table.Cell>
      </Table.Row>
    ))}
  </React.Fragment>
)

TableFields.propTypes = {
  fields: PropTypes.object.isRequired,
}

export default TableFields
