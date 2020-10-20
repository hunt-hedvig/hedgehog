import React from 'react'
import styled, { keyframes } from 'react-emotion'

const fadeIn = (max) =>
  keyframes({
    from: { opacity: 0, transform: 'translateY(2%)' },
    to: { opacity: max, transform: 'translateY(0)' },
  })

const StandaloneMessageWrapper = styled('div')<{
  paddingTop?: string
  paddingBottom?: string
  paddingLeft?: string
  paddingRight?: string
}>(({ paddingTop = '25vh', paddingBottom, paddingLeft, paddingRight }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  opacity: 0,
  animation: `${fadeIn(0.3)} 1000ms forwards`,
  animationDelay: '20ms',
  width: '100%',
  flex: 1,
  fontSize: '1.5rem',
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
}))

const AnimatedEllipsis = styled.span`
  &::after {
    display: inline-block;
    animation: ellipsis 1.5s infinite;
    content: '.';
    width: 1em;
    text-align: left;
  }
  @keyframes ellipsis {
    0% {
      content: '.';
    }
    33% {
      content: '..';
    }
    66% {
      content: '...';
    }
  }
`

interface StandaloneMessageProps {
  children: React.ReactNode
  paddingTop?: string
  paddingBottom?: string
  paddingLeft?: string
  paddingRight?: string
}

export const StandaloneMessage: React.FC<StandaloneMessageProps> = ({
  children,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
}) => {
  return (
    <StandaloneMessageWrapper
      paddingTop={paddingTop}
      paddingBottom={paddingBottom}
      paddingLeft={paddingLeft}
      paddingRight={paddingRight}
    >
      {children}
    </StandaloneMessageWrapper>
  )
}

export const LoadingMessage: React.FC<StandaloneMessageProps> = ({
  ...props
}) => {
  const { children, ...padding } = props

  return (
    <StandaloneMessage {...padding}>
      <AnimatedEllipsis>{children}</AnimatedEllipsis>
    </StandaloneMessage>
  )
}
