import styled from '@emotion/styled'
import React, { useState } from 'react'
import { AnimatePresence, motion, HTMLMotionProps } from 'framer-motion'
import { Key } from '../hooks/keyboard/use-key-is-pressed'
import chroma from 'chroma-js'
import toast from 'react-hot-toast'

const Wrapper = styled.div`
  position: relative;

  width: fit-content;
  height: fit-content;
`

const HintContainer = styled(motion.div)`
  position: absolute;

  right: 0;

  width: fit-content;

  display: flex;
  align-items: center;
  gap: 0.7rem;

  background-color: ${({ theme }) => theme.semiStrongForeground};
  border-radius: 0.25rem;
  padding: 0.3rem 0.3rem 0.3rem 0.5rem;

  & p {
    margin: 0;
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
    line-height: 0;
    color: ${({ theme }) =>
      chroma(theme.placeholderColor).brighten(0.6).hex()} !important;
  }
`

const HintKeys = styled.div`
  padding: 0.2rem 0.5rem;
  border-radius: 0.25rem;
  background-color: ${({ theme }) =>
    chroma(theme.placeholderColor).alpha(0.6).hex()};

  font-size: 12px;
  white-space: nowrap;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.backgroundLight} !important;
`

const getKeyHint = (key: Key) => {
  const keyHintSplitted = key.hint.split(' ')
  return keyHintSplitted.length > 1 ? keyHintSplitted[1] : keyHintSplitted[0]
}

const getFormattedKeysText = (keys: Key | Key[]) =>
  Array.isArray(keys)
    ? keys.map(
        (key, index) =>
          `${getKeyHint(key)}${index !== keys.length - 1 ? ' + ' : ''}`,
      )
    : keys.hint

interface HotkeyHintProps extends HTMLMotionProps<'div'> {
  text: string
  keys: Key | Key[]
  wrapperStyles?: React.CSSProperties
  position?: 'top' | 'bottom'
  side?: 'left' | 'right'
  disabled?: boolean
}

export const HotkeyHint: React.FC<HotkeyHintProps> = ({
  children,
  wrapperStyles,
  disabled,
  ...props
}) => {
  const [showHint, setShowHint] = useState(false)

  return (
    <Wrapper
      onMouseEnter={() => {
        if (!disabled) {
          setShowHint(true)
        }
      }}
      onMouseLeave={() => {
        if (!disabled) {
          setShowHint(false)
        }
      }}
      style={wrapperStyles}
      onClick={() => {
        const toastText = `Next time use ${getFormattedKeysText(
          props.keys,
        )} to ${props.text}`

        toast(toastText)
      }}
    >
      {children}
      <AnimatePresence>{showHint && <Hint {...props} />}</AnimatePresence>
    </Wrapper>
  )
}

export const Hint: React.FC<HotkeyHintProps> = ({
  text,
  keys,
  position,
  side,
  ...props
}) => {
  const positionStyles: React.CSSProperties =
    position === 'bottom'
      ? { top: 'calc(100% + 5px)' }
      : { bottom: 'calc(100% + 5px)' }

  const sideStyles: React.CSSProperties = side ? { [side]: 0 } : {}

  return (
    <HintContainer
      key="hint"
      initial={{ y: 15, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 15, opacity: 0 }}
      style={{ ...positionStyles, ...sideStyles }}
      {...props}
    >
      <p>{text}</p>
      <HintKeys>{getFormattedKeysText(keys)}</HintKeys>
    </HintContainer>
  )
}
