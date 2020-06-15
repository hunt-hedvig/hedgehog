import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core'
import { MainHeadline, ThirdLevelHeadline } from 'hedvig-ui/typography'
import * as React from 'react'
import { TextArea } from '../../../../shared/hedvig-ui/text-area'
import {
  ItemCategoryKind,
  useInsertItemCategoriesMutation,
} from '../../../api/generated/graphql'

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
  const header: DataRow = rows[0] ?? []
  const table = { header, rows: rows.slice(1) }

  const tableIsConsistent = !rows.find(
    ({ cells }) => cells.length !== Object.keys(ItemCategoryKind).length,
  )

  return tableIsConsistent ? table : null
}

export const ItemizerComponent: React.FC = () => {
  const [dataString, setDataString] = React.useState('')
  const [validity, setValidity] = React.useState<boolean[]>([])
  const tablePreview = interpretDataString(dataString)
  const [resetRequired, setResetRequired] = React.useState(false)
  const [insertItemCategories] = useInsertItemCategoriesMutation()

  const validityExists = validity.length !== 0

  return (
    <>
      <MainHeadline>Itemizer</MainHeadline>
      <ThirdLevelHeadline>Data input</ThirdLevelHeadline>
      {!resetRequired && (
        <TextArea
          placeholder={'Tab & newline separated table (i.e. Excel)'}
          value={dataString}
          setValue={setDataString}
        />
      )}
      <Button
        disabled={resetRequired || !tablePreview}
        onClick={() =>
          insertItemCategories({
            variables: { request: { itemCategoriesString: dataString } },
          }).then(({ data }) => {
            setResetRequired(true)
            setValidity(data?.insertItemCategories ?? [])
          })
        }
        style={{ marginTop: '15px' }}
        variant="contained"
        color="primary"
      >
        Add items
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
                <TableCell>Family</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Brand</TableCell>
                <TableCell>Model</TableCell>
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
