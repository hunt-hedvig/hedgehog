import { Input, InputProps } from '@hedvig-ui'
import React from 'react'

export const OnBlurChangeInput: React.FC<
  {
    originalValue: string
    onUpdate: (newTitle: string) => void
  } & InputProps
> = ({ originalValue, onUpdate, ...props }) => {
  const [value, setValue] = React.useState(() => originalValue)

  return (
    <Input
      value={value}
      onChange={(e) => setValue(e.currentTarget.value)}
      onBlur={() => onUpdate(value)}
      {...props}
    />
  )
}
