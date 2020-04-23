import { Button, Grid, TextField } from '@material-ui/core'
import { Paper } from 'components/shared/Paper'
import format from 'date-fns/format'
import { DatePicker } from 'material-ui-pickers'
import React, { useState } from 'react'
import Select from 'react-select'

const customStyles = {
  control: (base, { isFocused }) => ({
    ...base,
    marginTop: '6px',
    background: 'rgba(0, 0, 0, 0.0)',
    // match with the menu
    borderRadius: 0,
    border: '0px',
    borderBottom: isFocused ? '1px solid #0f007a' : '1px solid #999999',
    boxShadow: 'none',
  }),
  menu: (base) => ({
    ...base,
    borderRadius: 0,
    hyphens: 'auto',
    marginTop: 0,
    textAlign: 'left',
    wordWrap: 'break-word',
  }),
  valueContainer: (base) => ({
    ...base,
    paddingLeft: '0px',
    overflow: 'visible',
  }),
  multiValueRemove: (base) => ({ ...base, display: 'none' }),
  multiValue: (base) => ({
    ...base,
    paddingLeft: '5px',
    paddingRight: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
    border: '1px solid #5b30f5',
    borderRadius: 20,
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: '#5b30f5',
    fontWeight: 'bold',
  }),
}

const itemTree = [
  {
    value: 'Phone',
    children: [
      {
        value: 'Apple iPhone',
        children: [
          {
            value: '8',
            children: [
              { value: '64GB', children: [] },
              { value: '256GB', children: [] },
            ],
          },
          {
            value: '8 Plus',
            children: [
              { value: '64GB', children: [] },
              { value: '256GB', children: [] },
            ],
          },
          { value: 'X', children: [] },
          { value: '11', children: [] },
        ],
      },
      { value: 'Samsung', children: [] },
      { value: 'OnePlus', children: [] },
    ],
  },
  {
    value: 'TV',
    children: [
      { value: 'Samsung', children: [] },
      { value: 'LG', children: [] },
      { value: 'Toshiba', children: [] },
    ],
  },
]

export const ClaimInventory = ({ claimId }) => {
  const [itemName, setItemName] = useState(null)
  const [itemPurchaseValue, setItemPurchaseValue] = useState('')
  const [itemPurchaseDate, setItemPurchaseDate] = useState('')
  const [itemNote, setItemNote] = useState('')
  const [currentTree, setCurrentTree] = useState(itemTree)

  /*const { data: { inventory } = { inventory: [] } } = useGetInventoryQuery({
    variables: { claimId },
  })*/

  const getOptions = () => {
    return currentTree.map(({ value }) => {
      return { value, label: value }
    })
  }

  const navigateTree = (selectedOptions) => {
    if (!selectedOptions) {
      setCurrentTree(itemTree)
      return
    }

    const lastOption = selectedOptions.slice(-1).pop().value
    const nextTree =
      currentTree.find(({ value }) => {
        return value === lastOption
      })?.children ?? []

    setCurrentTree(nextTree)
  }

  return (
    <Paper>
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <div>
            <h3>Inventory</h3>
          </div>

          <form>
            <Grid container spacing={24}>
              <Grid item xs={6}>
                <Select
                  closeMenuOnSelect={false}
                  isMulti
                  styles={customStyles}
                  placeholder={'Phone, TV, Clothing...'}
                  value={itemName}
                  onChange={(selectedOptions) => {
                    setItemName(selectedOptions)
                    navigateTree(selectedOptions)
                  }}
                  options={getOptions()}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  fullWidth
                  color="secondary"
                  placeholder="Purchase value"
                  value={itemPurchaseValue}
                  onChange={(e) => setItemPurchaseValue(e.target.value)}
                />
              </Grid>
              <Grid item xs={2}>
                <DatePicker
                  autoOk
                  clearable
                  labelFunc={(date: Date) =>
                    date ? format(date, 'yyyy-MM-dd') : ''
                  }
                  fullWidth
                  value={itemPurchaseDate === '' ? null : itemPurchaseDate}
                  onChange={(date: Date) => {
                    date
                      ? setItemPurchaseDate(format(date, 'yyyy-MM-dd'))
                      : setItemPurchaseDate('')
                  }}
                  placeholder="Purchase date"
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  fullWidth
                  color="secondary"
                  placeholder="Note"
                  value={itemNote}
                  onChange={(e) => setItemNote(e.target.value)}
                />
              </Grid>
            </Grid>
            <Grid
              container
              alignItems="flex-start"
              justify="flex-end"
              direction="row"
              spacing={24}
              style={{ marginTop: '10px' }}
            >
              <Grid item xs={2}>
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  color="primary"
                  disabled={true}
                >
                  Add item
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Paper>
  )
}
