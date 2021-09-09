import { TextArea, ThirdLevelHeadline } from '@hedvig-ui'
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core'
import React from 'react'

export interface DataRow {
  cells: Array<string | null>
}

export interface DataTable {
  header: DataRow
  rows: DataRow[]
}

export const interpretDataString = (
  s: string,
  tableWidth: number,
): DataTable | null => {
  const rows: DataRow[] = s.split('\n').map((row) => {
    return { cells: row.split('\t') }
  })
  const header: DataRow = rows[0] ?? []
  const table = { header, rows: rows.slice(1) }

  const tableIsConsistent = !rows.find(
    ({ cells }) => cells.length !== tableWidth,
  )

  return tableIsConsistent ? table : null
}

export const TableInput: React.FC<{
  title: string
  headers: string[]
  onSubmit: (
    data: string,
    setValidity: React.EventHandler<any>,
    setResetRequired: React.EventHandler<any>,
  ) => void
}> = ({ title, headers, onSubmit }) => {
  const [dataString, setDataString] = React.useState('')
  const [validity, setValidity] = React.useState<boolean[]>([])
  const tablePreview = interpretDataString(dataString, headers.length)
  const [resetRequired, setResetRequired] = React.useState(false)

  const validityExists = validity.length !== 0

  return (
    <>
      <ThirdLevelHeadline>{title}</ThirdLevelHeadline>
      {!resetRequired && (
        <TextArea
          placeholder={'Tab & newline separated table (i.e. Excel)'}
          value={dataString}
          onChange={setDataString}
        />
      )}
      <Button
        disabled={resetRequired || !tablePreview}
        onClick={() => onSubmit(dataString, setValidity, setResetRequired)}
        style={{ marginTop: '15px' }}
        variant="contained"
        color="primary"
      >
        Add rules
      </Button>
      <Button
        disabled={!resetRequired}
        onClick={() => {
          setResetRequired(false)
          setValidity([])
          setDataString('')
        }}
        style={{ marginTop: '15px', marginLeft: '5px' }}
        variant="contained"
        color="primary"
      >
        Reset
      </Button>
      {tablePreview && (
        <>
          <ThirdLevelHeadline style={{ marginTop: '20px' }}>
            {resetRequired ? (
              <>
                Result (<span style={{ color: 'green' }}>Added</span>,{' '}
                <span style={{ color: 'red' }}>Not added</span>)
              </>
            ) : (
              'Preview'
            )}
          </ThirdLevelHeadline>
          <Table>
            <TableHead style={{ padding: '0px' }}>
              <TableRow>
                {headers.map((header) => (
                  <TableCell key={header}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tablePreview.rows.map((row, rowIndex) => (
                <TableRow key={row + rowIndex.toString()}>
                  {row.cells.map((cell, cellIndex) => {
                    const rowColor = validity[rowIndex] ? 'green' : 'red'
                    return (
                      <TableCell
                        style={{
                          backgroundColor: validityExists
                            ? rowColor
                            : 'transparent',
                        }}
                        key={cell + cellIndex.toString()}
                      >
                        {cell}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </>
  )
}
