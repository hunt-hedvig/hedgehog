import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core'
import { MainHeadline, ThirdLevelHeadline } from 'hedvig-ui/typography'
import * as React from 'react'
import { TextArea } from 'shared/hedvig-ui/text-area'

interface DataRow {
  cells: Array<string | null>
}

interface DataTable {
  header: DataRow
  rows: DataRow[]
}

const interpretDataString = (s: string): DataTable | null => {
  const rows: DataRow[] = s.split('\n').map((row) => {
    return { cells: row.split('\t') }
  })

  const consistentTable = !rows.find((row) => row.cells.length !== 5)

  return consistentTable ? { header: rows[0], rows } : null
}

export const ItemizerComponent: React.FC = () => {
  const [dataString, setDataString] = React.useState('')

  const tablePreview = interpretDataString(dataString)

  return (
    <>
      <MainHeadline>Itemizer</MainHeadline>
      <ThirdLevelHeadline>Data input</ThirdLevelHeadline>
      <TextArea
        error={true}
        placeholder={'Tab separated table'}
        value={dataString}
        setValue={setDataString}
      />
      <Table style={{ marginBottom: '7px' }}>
        <TableHead style={{ padding: '0px' }}>
          <TableRow>
            <TableCell>Family</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Company</TableCell>
            <TableCell>Brand</TableCell>
            <TableCell>Model</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tablePreview?.rows.map((row, index) => {
            return (
              <TableRow key={row + index.toString()}>
                {row.cells.map((cell) => (
                  <TableCell key={cell + index.toString()}>{cell}</TableCell>
                ))}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </>
  )
}
