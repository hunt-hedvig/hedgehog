import styled from '@emotion/styled'
import React, { InputHTMLAttributes } from 'react'
import { Keys } from '../utils/key-press-hook'

const RadioLabel = styled.div<{ checked?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  outline: none;

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
      background-color: ${({ theme, checked }) =>
        checked ? theme.accent : 'transparent'};
      border: 1px solid
        ${({ theme, checked }) => (checked ? theme.accent : theme.border)};
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
      background-color: ${({ theme, checked }) =>
        checked ? theme.accent : 'transparent'};
    }
  }

  &:focus {
    & label::before {
      box-shadow: 0px 0px 5px 1px rgba(34, 60, 80, 0.4);
    }
  }

  & input {
    display: none;
  }
`

interface RadioGroupProps {
  value: string
  setValue: any
  options: Array<{ value: string; label: string }>
}

interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onKeyDown'> {
  label: string
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void
}

const Radio: React.FC<RadioProps> = ({
  value,
  label,
  id,
  onKeyDown,
  checked,
  ...props
}) => (
  <RadioLabel tabIndex={0} onKeyDown={onKeyDown} checked={checked}>
    <input
      tabIndex={-1}
      type="radio"
      id={id}
      name="group"
      value={value}
      checked={checked}
      {...props}
    />
    <label htmlFor={id}>{label}</label>
  </RadioLabel>
)

export const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  setValue,
  options,
}) => (
  <>
    {options.map((opt, idx) => (
      <Radio
        key={opt.value}
        id={opt.value + idx}
        value={opt.value}
        label={opt.label}
        onChange={() => setValue(opt.value)}
        onKeyDown={(e) => {
          if (e.keyCode === Keys.Enter.code) {
            setValue(opt.value)
            return
          }
        }}
        checked={opt.value === value}
      />
    ))}
  </>
)
