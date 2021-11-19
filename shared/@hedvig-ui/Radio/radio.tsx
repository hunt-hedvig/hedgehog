import styled from '@emotion/styled'
import React, { InputHTMLAttributes } from 'react'
import { isPressing, Keys } from '../hooks/keyboard/use-key-is-pressed'

const RadioLabel = styled.div<{ checked?: boolean; disabled?: boolean }>`
  display: flex;
  align-items: center;
  outline: none;
  pointer-events: ${({ disabled }) => (!disabled ? 'auto' : 'none')};

  & label {
    display: flex;
    align-items: center;
    cursor: pointer;
    position: relative;
    padding-left: 25px;
    font-size: 14px;

    &::before {
      content: '';
      transition: all 0.2s;
      width: 15px;
      height: 15px;
      position: absolute;
      left: 0;
      border-radius: 50%;
      background-color: ${({ theme, checked, disabled }) =>
        checked && !disabled
          ? theme.accent
          : disabled
          ? theme.accentBackground
          : 'transparent'};
      border: 1px solid
        ${({ theme, checked, disabled }) =>
          checked && !disabled
            ? theme.accent
            : disabled
            ? theme.accentBackground
            : theme.border};
    }

    &::after {
      content: '';
      transition: all 0.2s;
      width: 13px;
      height: 13px;
      position: absolute;
      left: 1px;
      border: ${({ checked, theme }) =>
        checked ? `2px solid ${theme.backgroundLight}` : 'none'};
      border-radius: 50%;
      background-color: ${({ theme, checked, disabled }) =>
        checked && !disabled
          ? theme.accent
          : disabled
          ? theme.accentBackground
          : 'transparent'};
    }
  }

  &:focus {
    & label::before {
      box-shadow: 0 0 5px 1px rgba(34, 60, 80, 0.4);
    }
  }

  & input {
    display: none;
  }
`

interface RadioGroupProps {
  value?: string | number
  onChange?: any
  options: Array<{
    value: string | number
    label: string | React.ReactNode
    disabled?: boolean
  }>
}

interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onKeyDown'> {
  label: string | React.ReactNode
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void
}

const Radio: React.FC<RadioProps> = ({
  value,
  label,
  id,
  onKeyDown,
  checked,
  disabled,
  ...props
}) => (
  <RadioLabel
    tabIndex={!disabled ? 0 : -1}
    onKeyDown={onKeyDown}
    checked={checked}
    disabled={disabled}
  >
    <input
      tabIndex={-1}
      type="radio"
      id={id}
      name="group"
      value={value}
      checked={checked}
      disabled={disabled}
      {...props}
    />
    <label htmlFor={id}>{label}</label>
  </RadioLabel>
)

export const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  onChange,
  options,
}) => (
  <>
    {options.map((opt, idx) => (
      <Radio
        key={`${opt.value}` + idx}
        id={`${opt.value}` + idx}
        value={opt.value}
        label={opt.label}
        disabled={opt.disabled || false}
        onChange={() => onChange && onChange(opt.value)}
        onKeyDown={(e) => {
          if (isPressing(e, Keys.Enter)) {
            onChange(opt.value)
            return
          }
        }}
        checked={opt.value === value || false}
      />
    ))}
  </>
)
