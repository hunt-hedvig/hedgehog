import { keyframes } from '@emotion/react'
import styled, { StyledComponent } from '@emotion/styled'

const fadeInKeyframes = (max) =>
  keyframes({
    from: { opacity: 0, transform: 'translateY(2%)' },
    to: { opacity: max, transform: 'translateY(0)' },
  })

interface FadeInProps {
  delay?: string
  duration?: number
}

export const withFadeIn: <T extends object>(
  component,
  ...args
) => StyledComponent<FadeInProps, T, object> = (component, ...args) =>
  styled(
    component,
    ...args,
  )<FadeInProps>(({ delay = '0ms', duration = 1000 }) => ({
    opacity: 0,
    animation: `${fadeInKeyframes(1.0)} ${duration}ms forwards`,
    animationDelay: delay,
  }))

export const FadeIn = withFadeIn('div')
