import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import React, { InputHTMLAttributes } from 'react'
import { CheckCircleFill, ExclamationCircleFill } from 'react-bootstrap-icons'

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`

export type InputSize = 'small' | 'medium' | 'large'
const paddingSize: Record<InputSize, string> = {
  small: '5px 10px',
  medium: '10px 15px',
  large: '15px 20px',
}
const fontSize: Record<InputSize, string> = {
  small: '11px',
  medium: '14px',
  large: '18px',
}
const iconWidth: Record<InputSize, string> = {
  small: '15px',
  medium: '20px',
  large: '30px',
}

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

const iconStyles = (size?: InputSize, affix?: boolean) => `
  height: 65%;
  width: ${iconWidth[size || 'medium']};
  position: absolute;
  right: ${!affix ? '15px' : '75px'};
`

const SuccessIcon = styled(CheckCircleFill)<{
  inputSize?: InputSize
  affix?: boolean
}>`
  ${({ inputSize, affix }) => iconStyles(inputSize, affix)}
  color: ${({ theme }) => theme.success};
`

const ErrorIcon = styled(ExclamationCircleFill)<{
  inputSize?: InputSize
  affix?: boolean
}>`
  ${({ inputSize, affix }) => iconStyles(inputSize, affix)}
  color: ${({ theme }) => theme.danger};
`

const LoadingIcon = styled.div<{
  inputSize?: InputSize
  affix?: boolean
}>`
  ${({ inputSize, affix }) => iconStyles(inputSize, affix)}
  display: flex;
  align-items: center;
  justify-content: center;

  &:after {
    content: ' ';
    display: block;
    width: 90%;
    height: 90%;
    border-radius: 50%;
    border: 3px solid #000;
    border-color: #000 transparent #000 transparent;
    animation: ${rotate} 1s linear infinite;
  }
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

const Affix = styled.div<{ inputSize?: InputSize }>`
  font-size: 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  position: absolute;
  right: ${({ inputSize }) => (inputSize === 'small' ? '3px' : '5px')};

  border-radius: 0.25rem;
  background-color: ${({ theme }) => theme.accentBackground};
  border: 1px solid ${({ theme }) => theme.border};

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  height: calc(
    100% - ${({ inputSize }) => (inputSize === 'small' ? '6px' : '10px')}
  );
  width: 50px;
`

interface AffixType {
  content: string
}

export interface InputProps {
  disabled?: boolean
  error?: boolean
  success?: boolean
  muted?: boolean
  ref?: React.RefObject<HTMLInputElement>
  style?: React.CSSProperties
  inputSize?: InputSize
  loading?: boolean
  icon?: React.ReactNode
  affix?: AffixType
}

export const Input: React.FC<InputProps &
  InputHTMLAttributes<HTMLInputElement>> = ({
  success,
  error,
  disabled,
  loading,
  muted,
  icon,
  inputSize,
  affix,
  style,
  ...props
}) => {
  const isAffix = Boolean(affix)
  const isSuccess = success && !error && !loading
  const isError = error && !success && !loading

  return (
    <InputWrapper style={style}>
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
      {affix && affix.content && (
        <Affix inputSize={inputSize}>{affix.content}</Affix>
      )}
      {loading && <LoadingIcon affix={isAffix} inputSize={inputSize} />}
      {isSuccess && <SuccessIcon affix={isAffix} inputSize={inputSize} />}
      {isError && <ErrorIcon affix={isAffix} inputSize={inputSize} />}
    </InputWrapper>
  )
}
