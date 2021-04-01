import { useEffect, useRef, useState } from 'react'

export const KeyCode = {
  Backspace: 8,
  Tab: 9,
  Return: 13,
  Shift: 16,
  Control: 17,
  Option: 18,
  CapsLock: 20,
  Escape: 27,
  Space: 32,
  Left: 37,
  Up: 38,
  Right: 39,
  Down: 40,
  Zero: 48,
  One: 49,
  Two: 50,
  Three: 51,
  Four: 52,
  Five: 53,
  Six: 54,
  Seven: 55,
  Eight: 56,
  Nine: 57,
  A: 65,
  B: 66,
  C: 67,
  D: 68,
  E: 69,
  F: 70,
  G: 71,
  H: 72,
  I: 73,
  J: 74,
  K: 75,
  L: 76,
  M: 77,
  N: 78,
  O: 79,
  P: 80,
  Q: 81,
  R: 82,
  S: 83,
  T: 84,
  U: 85,
  V: 86,
  W: 87,
  X: 88,
  Y: 89,
  Z: 90,
  F1: 112,
  F2: 113,
  F3: 114,
  F4: 115,
  F5: 116,
  F6: 117,
  F7: 118,
  F8: 119,
  F9: 120,
  F10: 121,
  F11: 122,
  F12: 123,
  Comma: 188,
  Period: 190,
}

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

export const usePressedKeys = (ignore: boolean) => {
  const [keyDown, setKeyDown] = useState<number | null>(null)
  const [keyUp, setKeyUp] = useState<number | null>(null)
  const [pressedKeys, setPressedKeys] = useState<number[]>([])
  const ignoreRef = useRef(ignore)

  useEffect(() => {
    ignoreRef.current = ignore
  }, [ignore])

  useEffect(() => {
    if (!keyDown) {
      return
    }
    if (pressedKeys.includes(keyDown)) {
      return
    }
    const pressedKeysCopy = [...pressedKeys, keyDown]
    setPressedKeys(pressedKeysCopy)
    setKeyDown(null)
    setKeyUp(null)
  }, [keyDown])

  useEffect(() => {
    if (!keyUp) {
      return
    }
    const pressedKeysCopy = [...pressedKeys]
    setPressedKeys(pressedKeysCopy.filter((key) => key !== keyUp))
    setKeyDown(null)
    setKeyUp(null)
  }, [keyUp])

  const handleKeydown = (e) => {
    if (ignoreRef.current) {
      return
    }
    setKeyDown(e.keyCode)
  }

  const handleKeyup = (e) => {
    if (ignoreRef.current) {
      return
    }
    setKeyUp(e.keyCode)
  }

  const handleVisibility = () => {
    if (document.hidden) {
      setPressedKeys([])
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown, {
      capture: true,
    })
    window.addEventListener('keyup', handleKeyup, {
      capture: true,
    })
    document.addEventListener('visibilitychange', handleVisibility, {})
    return () => {
      window.removeEventListener('keydown', handleKeydown)
      window.removeEventListener('keyup', handleKeyup)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  return pressedKeys
}
