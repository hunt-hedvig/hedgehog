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
  useAddItemCategoriesMutation,
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

  const consistentTable = !rows.find(
    (row) => row.cells.length !== Object.keys(ItemCategoryKind).length,
  )

  return consistentTable ? { header, rows: rows.slice(1) } : null
}

export const ItemizerComponent: React.FC = () => {
  const [dataString, setDataString] = React.useState('')
  const [validity, setValidity] = React.useState<boolean[]>([])
  const tablePreview = interpretDataString(dataString)
  const [resetRequired, setResetRequired] = React.useState(false)

  const validityExists = validity.length !== 0

  const [addItemCategories] = useAddItemCategoriesMutation()

  return (
    <>
      <MainHeadline>Itemizer</MainHeadline>
      <ThirdLevelHeadline>Data input</ThirdLevelHeadline>
      <TextArea
        placeholder={'Tab separated table'}
        value={dataString}
        setValue={setDataString}
      />
      <Button
        disabled={resetRequired || !tablePreview}
        onClick={() =>
          addItemCategories({
            variables: { request: { itemCategoriesString: dataString } },
          }).then(({ data }) => {
            setResetRequired(true)
            setValidity(data?.addItemCategories ?? [])
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
            Preview
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
                    const rowColor = validity[rowIndex] ? '#c1ffc2' : '#ffa9b8'
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
