import { Checkbox } from '@hedvig-ui'
import { boolean } from '@storybook/addon-knobs'
import React from 'react'

export default {
  title: 'Checkbox',
  component: Checkbox,
  decorators: [],
}

export const StandardCheckbox: React.FC = () => {
  const [isChecked, setIsChecked] = React.useState(false)

  const checkHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.currentTarget.checked)
  }

  return (
    <div style={{ padding: 150 }}>
      <Checkbox
        style={{ marginBottom: 25 }}
        label="Check me"
        onChange={checkHandler}
        checked={isChecked}
        disabled={boolean('Disabled', false)}
      />
      <div>{isChecked ? 'Checked' : 'Unchecked'}</div>
    </div>
  )
}
