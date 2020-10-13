import { Dispatch, SetStateAction, useEffect, useState } from 'react'

export type KeyDownHandler = (e: KeyboardEvent) => void

export const useKeyboardListener = (
  isActive: boolean,
  handler: KeyDownHandler,
) => {
  useEffect(() => {
    const eventHandler = (e: KeyboardEvent) => {
      if (isActive) {
        handler(e)
      }
    }

    window.addEventListener('keydown', eventHandler)

    return () => {
      window.removeEventListener('keydown', eventHandler)
    }
  }, [isActive, handler])
}

export type PerformNavigationHandler = (index: number) => void
export type NavigationStepHandler = () => void
export type UseVerticalKeyboardNavigationProps = {
  maxStep: number
  isActive: boolean
  onPerformNavigation?: PerformNavigationHandler
  onNavigationStep?: NavigationStepHandler
}

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

export const useVerticalKeyboardNavigation = ({
  maxStep,
  isActive,
  onNavigationStep,
  onPerformNavigation,
}: UseVerticalKeyboardNavigationProps): [number] => {
  const [navigationIndex, setNavigationIndex] = useState(-1)

  useKeyboardListener(isActive, (e) => {
    if (e.key === 'Enter' && onPerformNavigation) {
      e.preventDefault()
      onPerformNavigation(navigationIndex)
      return
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      handleStepChange(setNavigationIndex, (i) => i > 0, -1)
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      handleStepChange(setNavigationIndex, (i) => i < maxStep, 1)
      return
    }
  })

  useEffect(() => {
    if (onNavigationStep && navigationIndex !== -1) {
      onNavigationStep()
    }
  }, [navigationIndex])

  return [navigationIndex]
}
