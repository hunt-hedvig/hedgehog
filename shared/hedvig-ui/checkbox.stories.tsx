import { Checkbox } from 'hedvig-ui/checkbox'
import React from 'react'

export default {
  title: 'Checkbox',
  component: Checkbox,
  decorators: [],
}

export const StandardCheckbox: React.FC = () => {
  const [isChecked, setIsChecked] = React.useState(false)
  return (
    <>
      <Checkbox
        label="Check me"
        onChange={(_e, { checked }) => setIsChecked(checked ?? false)}
      />
      <div>{isChecked ? 'Checked' : 'Unchecked'}</div>
    </>
  )
}
