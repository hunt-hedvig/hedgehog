import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { useElementFocus } from '@hedvig-ui/hooks/use-element-focus'
import React, { InputHTMLAttributes, useRef } from 'react'
import { CheckCircleFill, ExclamationCircleFill } from 'react-bootstrap-icons'
import { Spinner } from '../Spinner/spinner'

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
  isLoading?: boolean
  inputSize?: InputSize
  withIcon?: boolean
}>`
  transition: all 0.3s;

  width: 100%;

  padding: ${({ inputSize }) => paddingSize[inputSize || 'medium']};
  ${({ withIcon }) =>
    withIcon &&
    css`
      padding-left: 40px;
    `}

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

  font-family: inherit;
  font-size: ${({ inputSize }) => fontSize[inputSize || 'medium']};
  color: ${({ disabled, theme }) =>
    !disabled ? theme.foreground : theme.placeholderColor};
  background-color: ${({ muted, theme }) =>
    !muted ? theme.backgroundLight : theme.accentBackground};

  ${({ disabled, isLoading }) =>
    (disabled || isLoading) &&
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
  }
`

const iconStyles = (size?: InputSize, affix?: boolean) => `
  height: 65%;
  width: ${iconWidth[size || 'medium']};
  position: absolute;
  right: ${!affix ? '15px' : '75px'};
`

const SuccessIcon = styled(CheckCircleFill)<{
  size?: InputSize
  affix?: number
}>`
  ${({ size, affix }) => iconStyles(size, affix && affix > 0 ? true : false)}
  color: ${({ theme }) => theme.success};
`

const ErrorIcon = styled(ExclamationCircleFill)<{
  size?: InputSize
  affix?: number
}>`
  ${({ size, affix }) => iconStyles(size, affix && affix > 0 ? true : false)}
  color: ${({ theme }) => theme.danger};
`

const Loading = styled(Spinner)<{
  size?: InputSize
  affix?: number
}>`
  ${({ size, affix }) => iconStyles(size, affix && affix > 0 ? true : false)}
  width: ${({ size }) => iconWidth[size || 'medium']};
  height: ${({ size }) => iconWidth[size || 'medium']};
`

const CustomIcon = styled.div`
  position: absolute;
  left: 12px;

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

const Affix = styled.div<{ size?: InputSize }>`
  font-size: 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  position: absolute;
  right: ${({ size }) => (size === 'small' ? '3px' : '5px')};

  border-radius: 0.25rem;
  background-color: ${({ theme }) => theme.accentBackground};
  border: 1px solid ${({ theme }) => theme.border};

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  height: calc(100% - ${({ size }) => (size === 'small' ? '6px' : '10px')});
  width: 50px;
`

interface AffixType {
  content: string
}

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  disabled?: boolean
  error?: boolean
  success?: boolean
  muted?: boolean
  style?: React.CSSProperties
  size?: InputSize
  loading?: boolean
  icon?: React.ReactNode
  focus?: boolean
  affix?: AffixType
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      success,
      error,
      disabled,
      loading,
      muted,
      icon,
      size,
      affix,
      style,
      focus,
      ...props
    },
    _,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const isAffix = Boolean(affix)
    const isSuccess = success && !error && !loading
    const isError = error && !success && !loading

    useElementFocus(inputRef, focus)

    return (
      <InputWrapper style={style}>
        {icon ? <CustomIcon>{icon}</CustomIcon> : null}
        <InputStyled
          ref={inputRef}
          className="input"
          withIcon={Boolean(icon)}
          inputSize={size}
          success={success}
          error={error}
          isLoading={loading}
          muted={muted}
          disabled={disabled}
          placeholder={props.placeholder}
          onWheel={(e) => {
            if (props.type === 'number') {
              e.currentTarget.blur()
            } else if (props.onWheel) {
              props.onWheel(e)
            }
          }}
          {...props}
        />
        {affix && affix.content && <Affix size={size}>{affix.content}</Affix>}
        {loading && <Loading affix={isAffix ? 1 : 0} size={size} />}
        {isSuccess && <SuccessIcon affix={isAffix ? 1 : 0} size={size} />}
        {isError && <ErrorIcon affix={isAffix ? 1 : 0} size={size} />}
      </InputWrapper>
    )
  },
)
