import React from 'react'
import { Input, InputProps } from 'semantic-ui-react'

export const OnBlurChangeInput: React.FC<{
  originalValue: string
  onUpdate: (newTitle: string) => void
} & InputProps> = ({ originalValue, onUpdate, ...props }) => {
  const [value, setValue] = React.useState(() => originalValue)

  return (
    <Input
      value={value}
      onChange={(_, data) => setValue(data.value)}
      onBlur={() => onUpdate(value)}
      {...props}
    />
  )
}
