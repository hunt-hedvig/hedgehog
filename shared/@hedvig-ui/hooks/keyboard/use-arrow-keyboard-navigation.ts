import { isPressing, Keys } from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import {
  useKeyboardListener,
  UseVerticalKeyboardNavigationProps,
} from '@hedvig-ui/hooks/keyboard/use-keyboard-listener'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

const handleStepChange = (
  setIndex: Dispatch<SetStateAction<number>>,
  isWithinBounds: (currentIndex: number) => boolean,
  delta: number,
) => {
  setIndex((currentIndex) => {
    if (isWithinBounds(currentIndex)) {
      return currentIndex + delta
    } else {
      return currentIndex
    }
  })
}

export const useArrowKeyboardNavigation = ({
  maxStep,
  onNavigationStep,
  onPerformNavigation,
  defaultNavigationStep,
  onExit,
  isActive = false,
  direction = 'vertical',
  withNegative = false,
}: UseVerticalKeyboardNavigationProps): [number, () => void] => {
  const [navigationIndex, setNavigationIndex] = useState(
    defaultNavigationStep ?? -1,
  )
  const reset = () => {
    setNavigationIndex(-1)
  }

  useEffect(() => {
    setNavigationIndex(defaultNavigationStep ?? -1)
  }, [defaultNavigationStep])

  useKeyboardListener(isActive, (e) => {
    if (
      (!withNegative ? navigationIndex !== -1 : true) &&
      isPressing(e, Keys.Enter) &&
      onPerformNavigation
    ) {
      e.preventDefault()
      onPerformNavigation(navigationIndex)
      return
    }

    if (isPressing(e, direction === 'vertical' ? Keys.Up : Keys.Left)) {
      e.preventDefault()
      if (withNegative ? navigationIndex === -1 : navigationIndex === 0) {
        onExit?.()
      }
      handleStepChange(setNavigationIndex, (i) => i > -1, -1)
      return
    }

    if (isPressing(e, direction === 'vertical' ? Keys.Down : Keys.Right)) {
      e.preventDefault()
      handleStepChange(setNavigationIndex, (i) => i < maxStep, 1)
      return
    }
  })

  useEffect(() => {
    if (onNavigationStep && (!withNegative ? navigationIndex !== -1 : true)) {
      onNavigationStep()
    }
  }, [navigationIndex])

  return [navigationIndex, reset]
}
