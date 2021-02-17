import { useEffect, useState } from 'react'

export const KeyCode = {
  Option: 18,
  Q: 81,
  W: 87,
  R: 82,
  T: 84,
  A: 65,
  S: 83,
  D: 68,
  G: 71,
  L: 76,
  C: 67,
  M: 77,
  Left: 37,
  Right: 39,
  One: 49,
  Nine: 57,
  Backspace: 8,
  Enter: 13,
}

export const isAllowedOptionKeyCode = (keyCode: number | null) =>
  keyCode == null || (keyCode >= KeyCode.One && keyCode <= KeyCode.Nine)

export const useKeyIsPressed = (keyCode: number): boolean => {
  const [keyPressed, setKeyPressed] = useState(false)

  const handleKeydown = (e) => {
    if (e.keyCode === keyCode) {
      setKeyPressed(true)
    }
  }

  const handleKeyup = (e) => {
    if (e.keyCode === keyCode) {
      setKeyPressed(false)
    }
  }

  const handleVisibility = () => {
    if (document.hidden) {
      setKeyPressed(false)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown)
    window.addEventListener('keyup', handleKeyup)
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      window.removeEventListener('keydown', handleKeydown)
      window.removeEventListener('keyup', handleKeyup)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  return keyPressed
}

export const usePressedKey = (): number | null => {
  const [pressedKey, setPressedKey] = useState<number | null>(null)

  const handleKeydown = ({ keyCode }) => {
    setPressedKey(keyCode)
  }

  const handleKeyup = () => {
    setPressedKey(null)
  }

  const handleVisibility = () => {
    if (document.hidden) {
      setPressedKey(null)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown)
    window.addEventListener('keyup', handleKeyup)
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      window.removeEventListener('keydown', handleKeydown)
      window.removeEventListener('keyup', handleKeyup)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  return pressedKey
}
