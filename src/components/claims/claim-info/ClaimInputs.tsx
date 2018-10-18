import DateInput from 'components/shared/inputs/DateInput'
import TextInput from 'components/shared/inputs/TextInput'
import * as types from 'lib/claimFieldsTypes'
import * as React from 'react'
import { Dropdown } from 'semantic-ui-react'

const boolOptions = [
  { key: 1, value: 'YES', text: 'Yes' },
  { key: 2, value: 'NO', text: 'No' },
]
export default {
  [types.TEXT](onChangeHandler, cleanupForm, value) {
    return (
      <TextInput
        changeHandler={onChangeHandler}
        cleanupForm={cleanupForm}
        disabled={!!value}
        value={value}
      />
    )
  },

  [types.DATE](onChangeHandler, cleanupForm, value) {
    return (
      <DateInput
        changeHandler={onChangeHandler}
        cleanupForm={cleanupForm}
        disabled={!!value}
        date={value}
      />
    )
  },

  [types.BOOL](onChangeHandler, cleanupForm, value) {
    return (
      <Dropdown
        onChange={onChangeHandler.bind(this, types.BOOL)}
        options={boolOptions}
        value={value}
        disabled={!!value}
        selection
      />
    )
  },

  [types.ASSET](onChangeHandler, cleanupForm, value) {
    return (
      <TextInput
        changeHandler={onChangeHandler}
        cleanupForm={cleanupForm}
        value={value}
        disabled={!!value}
      />
    )
  },
}
