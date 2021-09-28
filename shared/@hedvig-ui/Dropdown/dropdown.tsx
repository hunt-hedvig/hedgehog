import React, { useEffect, useMemo, useRef } from 'react'
import {
  Dropdown as SemanticDropdown,
  DropdownItemProps,
  DropdownProps,
  Ref,
} from 'semantic-ui-react'

export const Dropdown: React.FC<{
  options: DropdownItemProps[]
  onChange: (value: string) => void
  value: string
  loading?: boolean
  onRender?: () => React.ReactNode | null
  emptyLabel?: string
  className?: string
} & Omit<DropdownProps, 'onChange' | 'selection'>> = ({
  options,
  onChange,
  value,
  loading,
  onRender,
  emptyLabel,
  className,
  ...props
}) => {
  return (
    <SemanticDropdown
      value={value}
      loading={loading}
      onChange={(_, { value: selection }) => onChange(selection as string)}
      fluid
      options={options}
      selectOnBlur={false}
      selectOnNavigation={false}
      className={'selection ' + (className ?? '')}
      trigger={onRender ? onRender() : undefined}
      {...props}
    />
  )
}

export const EnumDropdown: React.FC<{
  value?: any
  enumToSelectFrom: any
  placeholder?: string
  onChange: (value: any) => void
  loading?: boolean
  focus?: boolean
}> = ({
  enumToSelectFrom,
  placeholder = '',
  onChange,
  value,
  loading,
  focus,
}) => {
  const dropdownOptions = useMemo(
    () =>
      Object.values(enumToSelectFrom).map((selection, index) => {
        if (typeof value === 'number') {
          throw new Error(
            `EnumDropdown does not support enums with ordinal values (yet), enumToSelectFrom: ${JSON.stringify(
              enumToSelectFrom,
            )}`,
          )
        }
        return {
          key: index + 1,
          value: selection as string,
          text: getTextFromEnumValue(selection as string),
        }
      }),
    [enumToSelectFrom],
  )

  const dropdownRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (dropdownRef.current && focus) {
      dropdownRef.current.focus()
    }
  }, [focus])

  return (
    <Ref innerRef={dropdownRef}>
      <SemanticDropdown
        value={value}
        placeholder={placeholder}
        options={dropdownOptions}
        loading={loading}
        selection
        fluid
        onChange={(_, { value: selection }) => onChange(selection)}
      />
    </Ref>
  )
}

export const getTextFromEnumValue = (
  sentence: string,
  capitalized: boolean = false,
) => {
  return sentence
    .toLowerCase()
    .split('_')
    .map((word, index) => {
      if (capitalized || index === 0 || word === 'hedvig') {
        return word.charAt(0).toUpperCase() + word.slice(1)
      }
      return word
    })
    .join(' ')
}