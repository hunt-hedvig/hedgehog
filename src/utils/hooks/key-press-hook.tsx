import { useEffect, useRef, useState } from 'react'

export interface Key {
  code: number
  hint: string
}

export const Keys: { [name: string]: Key } = {
  Escape: {
    code: 27,
    hint: 'esc',
  },
  Backspace: {
    code: 8,
    hint: '⌫',
  },
  Tab: {
    code: 9,
    hint: '⇥',
  },
  Return: {
    code: 13,
    hint: '↩',
  },
  Shift: {
    code: 16,
    hint: '⇧',
  },
  Control: {
    code: 17,
    hint: 'control ⌃',
  },
  Option: {
    code: 18,
    hint: 'option ⌥',
  },
  CapsLock: {
    code: 20,
    hint: '⇪',
  },
  Command: {
    code: 91,
    hint: '⌘',
  },
  Space: {
    code: 32,
    hint: '␣',
  },
  Left: {
    code: 37,
    hint: '←',
  },
  Up: {
    code: 38,
    hint: '↑',
  },
  Right: {
    code: 39,
    hint: '→',
  },
  Down: {
    code: 40,
    hint: '↓',
  },
  Zero: {
    code: 48,
    hint: '0',
  },
  One: {
    code: 49,
    hint: '1',
  },
  Two: {
    code: 50,
    hint: '2',
  },
  Three: {
    code: 51,
    hint: '3',
  },
  Four: {
    code: 52,
    hint: '4',
  },
  Five: {
    code: 53,
    hint: '5',
  },
  Six: {
    code: 54,
    hint: '6',
  },
  Seven: {
    code: 55,
    hint: '7',
  },
  Eight: {
    code: 56,
    hint: '8',
  },
  Nine: {
    code: 57,
    hint: '9',
  },
  A: {
    code: 65,
    hint: 'A',
  },
  B: {
    code: 66,
    hint: 'B',
  },
  C: {
    code: 67,
    hint: 'C',
  },
  D: {
    code: 68,
    hint: 'D',
  },
  E: {
    code: 69,
    hint: 'E',
  },
  F: {
    code: 70,
    hint: 'F',
  },
  G: {
    code: 71,
    hint: 'G',
  },
  H: {
    code: 72,
    hint: 'H',
  },
  I: {
    code: 73,
    hint: 'I',
  },
  J: {
    code: 74,
    hint: 'J',
  },
  K: {
    code: 75,
    hint: 'K',
  },
  L: {
    code: 76,
    hint: 'L',
  },
  M: {
    code: 77,
    hint: 'M',
  },
  N: {
    code: 78,
    hint: 'N',
  },
  O: {
    code: 79,
    hint: 'O',
  },
  P: {
    code: 80,
    hint: 'P',
  },
  Q: {
    code: 81,
    hint: 'Q',
  },
  R: {
    code: 82,
    hint: 'R',
  },
  S: {
    code: 83,
    hint: 'S',
  },
  T: {
    code: 84,
    hint: 'T',
  },
  U: {
    code: 85,
    hint: 'U',
  },
  V: {
    code: 86,
    hint: 'V',
  },
  W: {
    code: 87,
    hint: 'W',
  },
  X: {
    code: 88,
    hint: 'X',
  },
  Y: {
    code: 89,
    hint: 'Y',
  },
  Z: {
    code: 90,
    hint: 'Z',
  },
  F1: {
    code: 112,
    hint: 'F1',
  },
  F2: {
    code: 113,
    hint: 'F2',
  },
  F3: {
    code: 114,
    hint: 'F3',
  },
  F4: {
    code: 115,
    hint: 'F4',
  },
  F5: {
    code: 116,
    hint: 'F5',
  },
  F6: {
    code: 117,
    hint: 'F6',
  },
  F7: {
    code: 118,
    hint: 'F7',
  },
  F8: {
    code: 119,
    hint: 'F8',
  },
  F9: {
    code: 120,
    hint: 'F9',
  },
  F10: {
    code: 121,
    hint: 'F10',
  },
  F11: {
    code: 122,
    hint: 'F11',
  },
  F12: {
    code: 123,
    hint: 'F12',
  },
}

const IllegalCharacters = new Set([
  '•',
  'Ω',
  'é',
  '®',
  '†',
  'µ',
  'ü',
  'ı',
  'œ',
  'π',
  '',
  'ß',
  '∂',
  'ƒ',
  '¸',
  '˛',
  '√',
  'ª',
  'ﬁ',
  '÷',
  '≈',
  'ç',
  '‹',
  '›',
  '‘',
  '’',
])

export const shouldIgnoreInput = (key: string) => IllegalCharacters.has(key)

export const useKeyIsPressed = (key: Key): boolean => {
  const [keyPressed, setKeyPressed] = useState(false)

  const handleKeydown = (e) => {
    if (e.keyCode === key.code) {
      setKeyPressed(true)
    }
  }

  const handleKeyup = (e) => {
    if (e.keyCode === key.code) {
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

export const usePressedKeys = (): number[] => {
  const pressedKeysRef = useRef<Set<number>>(new Set())
  const [pressedKeys, setPressedKeys] = useState<number[]>([])

  const isModifierKey = (keyCode) =>
    keyCode === Keys.Option.code || keyCode === Keys.Control.code
  const modifierIsPressed = () =>
    pressedKeysRef.current.has(Keys.Option.code) ||
    pressedKeysRef.current.has(Keys.Control.code)

  const reset = () => {
    pressedKeysRef.current = new Set()
    setPressedKeys([])
  }

  const handleKeydown = (e) => {
    if (e.keyCode === Keys.Escape.code) {
      reset()
      return
    }
    if (isModifierKey(e.keyCode) || modifierIsPressed()) {
      pressedKeysRef.current.add(e.keyCode)
      setPressedKeys(Array.from(pressedKeysRef.current))
    }
  }

  const handleKeyup = (e) => {
    if (isModifierKey(e.keyCode) || modifierIsPressed()) {
      pressedKeysRef.current.delete(e.keyCode)
      setPressedKeys(Array.from(pressedKeysRef.current))
    }
  }

  const handleVisibility = () => {
    if (document.hidden) {
      reset()
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
