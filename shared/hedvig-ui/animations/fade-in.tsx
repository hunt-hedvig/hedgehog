import styled, { keyframes, StyledComponent } from 'react-emotion'

const fadeInKeyframes = (max) =>
  keyframes({
    from: { opacity: 0, transform: 'translateY(2%)' },
    to: { opacity: max, transform: 'translateY(0)' },
  })

export const withFadeIn: (
  component,
  ...args
) => StyledComponent<object, object, object> = (component, ...args) =>
  styled(
    component,
    ...args,
  )<{ delay?: string }>(({ delay = '0ms' }) => ({
    opacity: 0,
    animation: `${fadeInKeyframes(1.0)} 1000ms forwards`,
    animationDelay: delay,
  }))

export const FadeIn = withFadeIn('div')
