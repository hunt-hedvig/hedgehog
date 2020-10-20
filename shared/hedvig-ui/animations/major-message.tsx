import React from 'react'
import styled, { keyframes } from 'react-emotion'

const fadeIn = (max) =>
  keyframes({
    from: { opacity: 0, transform: 'translateY(2%)' },
    to: { opacity: max, transform: 'translateY(0)' },
  })

const MajorMessageWrapper = styled('div')<{
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

export const MajorMessage: React.FC<{
  children: React.ReactNode
  paddingTop?: string
  paddingBottom?: string
  paddingLeft?: string
  paddingRight?: string
}> = ({ children, paddingTop, paddingBottom, paddingLeft, paddingRight }) => {
  return (
    <MajorMessageWrapper
      paddingTop={paddingTop}
      paddingBottom={paddingBottom}
      paddingLeft={paddingLeft}
      paddingRight={paddingRight}
    >
      {children}
    </MajorMessageWrapper>
  )
}

export const MajorLoadingMessage: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <MajorMessage>
      <AnimatedEllipsis>{children}</AnimatedEllipsis>
    </MajorMessage>
  )
}
