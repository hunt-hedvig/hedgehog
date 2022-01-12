import { keyframes } from '@emotion/react'
import styled, { StyledComponent } from '@emotion/styled'

const fadeInKeyframes = (maxOpacity, translateTo) =>
  keyframes({
    from: { opacity: 0, transform: translateTo },
    to: { opacity: maxOpacity, transform: 'translateY(0)' },
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
  )<FadeInProps>(
    ({ delay = '0ms', duration = 1000, translateTo = 'translateY(2%)' }) => ({
      opacity: 0,
      animation: `${fadeInKeyframes(1.0, translateTo)} ${duration}ms forwards`,
      animationDelay: delay,
    }),
  )

export const FadeIn = withFadeIn('div')
