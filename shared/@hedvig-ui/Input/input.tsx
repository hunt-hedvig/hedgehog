import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import React from 'react'
import {
  ArrowRepeat,
  CheckCircleFill,
  ExclamationCircleFill,
} from 'react-bootstrap-icons'

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`

export type InputSize = 'small' | 'medium' | 'big'
const paddingSize = { small: '5px 10px', medium: '10px 15px', big: '15px 20px' }
const fontSize = { small: '11px', medium: '14px', big: '18px' }

const InputWrapper = styled.div`
  width: 100%;

  position: relative;
  display: flex;
  align-items: center;
`

const InputStyled = styled.input<{
  success?: boolean
  error?: boolean
  disabled?: boolean
  muted?: boolean
  loading?: boolean
  inputSize?: InputSize
  withIcon?: boolean
}>`
  transition: all 0.3s;

  width: 100%;

  padding: ${({ inputSize }) => paddingSize[inputSize || 'medium']};
  ${({ withIcon }) => withIcon && 'padding-left: 55px;'}

  border-radius: 0.25rem;
  outline: none;
  border: 1px solid
    ${({ success, error, disabled, theme }) =>
      success
        ? theme.success
        : error
        ? theme.danger
        : disabled
        ? theme.placeholderColor
        : theme.border};

  ${({ muted }) => muted && 'border: none;'}

  font-size: ${({ inputSize }) => fontSize[inputSize || 'medium']};
  font-weight: bold;
  color: ${({ disabled, theme }) =>
    !disabled ? theme.foreground : theme.placeholderColor};
  background-color: ${({ muted, theme }) =>
    !muted ? theme.background : theme.accentBackground};

  ${({ disabled, loading }) =>
    (disabled || loading) &&
    `
  pointer-events: none;
  user-focus: none;
  user-modify: read-only;
  user-select: none;
  `}

  &::placeholder {
    color: ${({ theme }) => theme.placeholderColor};
  }

  &:focus {
    border-color: ${({ theme }) => theme.borderStrong};

    &::placeholder {
      color: ${({ theme, muted }) => !muted && theme.semiStrongForeground};
    }
  }
`

const iconStyles = `
  position: absolute;
  right: 15px;
`

const SuccessIcon = styled(CheckCircleFill)`
  ${iconStyles}
  color: ${({ theme }) => theme.success};
`

const ErrorIcon = styled(ExclamationCircleFill)`
  ${iconStyles}
  color: ${({ theme }) => theme.danger};
`

const LoadingIcon = styled(ArrowRepeat)`
  ${iconStyles}
  animation: ${rotate} 2s linear infinite;
`

const CustomIcon = styled.div`
  position: absolute;
  left: 20px;

  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;

  & * {
    width: 100%;
    height: 100%;
  }
`

export interface InputProps {
  autoFocus?: boolean
  disabled?: boolean
  error?: boolean
  success?: boolean
  muted?: boolean
  placeholder?: string
  value?: string | number
  id?: string
  type?: string
  name?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  ref?: React.RefObject<HTMLInputElement>
  onFocus?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (event: React.ChangeEvent<HTMLInputElement>) => void
  style?: React.CSSProperties
  size?: InputSize
  loading?: boolean
  icon?: React.ReactNode

  // Add affix and ?rules?
}

export const Input: React.FC<InputProps> = ({
  success,
  error,
  disabled,
  loading,
  muted,
  icon,
  size: inputSize,
  ...props
}) => {
  return (
    <InputWrapper>
      {icon ? <CustomIcon>{icon}</CustomIcon> : null}
      <InputStyled
        className="input"
        withIcon={Boolean(icon)}
        inputSize={inputSize}
        success={success}
        error={error}
        loading={loading}
        muted={muted}
        disabled={disabled}
        placeholder={props.placeholder}
        {...props}
      />
      {loading && <LoadingIcon />}
      {success && !error && !loading && <SuccessIcon />}
      {error && !success && !loading && <ErrorIcon />}
    </InputWrapper>
  )
}
