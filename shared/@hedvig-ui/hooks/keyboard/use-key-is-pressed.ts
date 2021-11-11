import { useEffect, useState } from 'react'

export interface Key {
  key: string
  code: number
  hint: string
}

export const Keys: { [name: string]: Key } = {
  Escape: {
    key: 'Escape',
    code: 27,
    hint: 'Esc',
  },
  Backspace: {
    key: 'Backspace',
    code: 8,
    hint: 'Backspace ⌫',
  },
  Tab: {
    key: 'Tab',
    code: 9,
    hint: 'Tab ⇥',
  },
  Enter: {
    key: 'Enter',
    code: 13,
    hint: 'Enter ↩',
  },
  Shift: {
    key: 'Shift',
    code: 16,
    hint: 'Shift ⇧',
  },
  Control: {
    key: 'Control',
    code: 17,
    hint: 'Control ⌃',
  },
  Option: {
    key: 'Alt',
    code: 18,
    hint: 'Option ⌥',
  },
  CapsLock: {
    key: 'CapsLock',
    code: 20,
    hint: 'Caps ⇪',
  },
  Command: {
    key: 'Command',
    code: 91,
    hint: 'Command ⌘',
  },
  Space: {
    key: 'Space',
    code: 32,
    hint: 'Space ␣',
  },
  Left: {
    key: 'ArrowLeft',
    code: 37,
    hint: 'Left ←',
  },
  Up: {
    key: 'ArrowUp',
    code: 38,
    hint: 'Up ↑',
  },
  Right: {
    key: 'ArrowRight',
    code: 39,
    hint: 'Right →',
  },
  Down: {
    key: 'ArrowDown',
    code: 40,
    hint: 'Down ↓',
  },
  Zero: {
    code: 48,
    hint: '0',
    key: '0',
  },
  One: {
    code: 49,
    hint: '1',
    key: '1',
  },
  Two: {
    code: 50,
    hint: '2',
    key: '2',
  },
  Three: {
    code: 51,
    hint: '3',
    key: '3',
  },
  Four: {
    code: 52,
    hint: '4',
    key: '4',
  },
  Five: {
    code: 53,
    hint: '5',
    key: '5',
  },
  Six: {
    code: 54,
    hint: '6',
    key: '6',
  },
  Seven: {
    code: 55,
    hint: '7',
    key: '7',
  },
  Eight: {
    code: 56,
    hint: '8',
    key: '8',
  },
  Nine: {
    code: 57,
    hint: '9',
    key: '9',
  },
  A: {
    code: 65,
    hint: 'A',
    key: 'A',
  },
  B: {
    code: 66,
    hint: 'B',
    key: 'B',
  },
  C: {
    code: 67,
    hint: 'C',
    key: 'C',
  },
  D: {
    code: 68,
    hint: 'D',
    key: 'D',
  },
  E: {
    code: 69,
    hint: 'E',
    key: 'E',
  },
  F: {
    code: 70,
    hint: 'F',
    key: 'F',
  },
  G: {
    code: 71,
    hint: 'G',
    key: 'G',
  },
  H: {
    code: 72,
    hint: 'H',
    key: 'H',
  },
  I: {
    code: 73,
    hint: 'I',
    key: 'I',
  },
  J: {
    code: 74,
    hint: 'J',
    key: 'J',
  },
  K: {
    code: 75,
    hint: 'K',
    key: 'K',
  },
  L: {
    code: 76,
    hint: 'L',
    key: 'L',
  },
  M: {
    code: 77,
    hint: 'M',
    key: 'M',
  },
  N: {
    code: 78,
    hint: 'N',
    key: 'N',
  },
  O: {
    code: 79,
    hint: 'O',
    key: 'O',
  },
  P: {
    code: 80,
    hint: 'P',
    key: 'P',
  },
  Q: {
    code: 81,
    hint: 'Q',
    key: 'Q',
  },
  R: {
    code: 82,
    hint: 'R',
    key: 'R',
  },
  S: {
    code: 83,
    hint: 'S',
    key: 'S',
  },
  T: {
    code: 84,
    hint: 'T',
    key: 'T',
  },
  U: {
    code: 85,
    hint: 'U',
    key: 'U',
  },
  V: {
    code: 86,
    hint: 'V',
    key: 'V',
  },
  W: {
    code: 87,
    hint: 'W',
    key: 'W',
  },
  X: {
    code: 88,
    hint: 'X',
    key: 'X',
  },
  Y: {
    code: 89,
    hint: 'Y',
    key: 'Y',
  },
  Z: {
    code: 90,
    hint: 'Z',
    key: 'Z',
  },
  F1: {
    code: 112,
    hint: 'F1',
    key: 'F1',
  },
  F2: {
    code: 113,
    hint: 'F2',
    key: 'F2',
  },
  F3: {
    code: 114,
    hint: 'F3',
    key: 'F3',
  },
  F4: {
    code: 115,
    hint: 'F4',
    key: 'F4',
  },
  F5: {
    code: 116,
    hint: 'F5',
    key: 'F5',
  },
  F6: {
    code: 117,
    hint: 'F6',
    key: 'F6',
  },
  F7: {
    code: 118,
    hint: 'F7',
    key: 'F7',
  },
  F8: {
    code: 119,
    hint: 'F8',
    key: 'F8',
  },
  F9: {
    code: 120,
    hint: 'F9',
    key: 'F9',
  },
  F10: {
    code: 121,
    hint: 'F10',
    key: 'F10',
  },
  F11: {
    code: 122,
    hint: 'F11',
    key: 'F11',
  },
  F12: {
    code: 123,
    hint: 'F12',
    key: 'F12',
  },
}

export const NumberKeys: ReadonlyArray<Key> = [
  Keys.Zero,
  Keys.One,
  Keys.Two,
  Keys.Three,
  Keys.Four,
  Keys.Five,
  Keys.Six,
  Keys.Seven,
  Keys.Eight,
  Keys.Nine,
]

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
  ' ',
])

export const shouldIgnoreInput = (key: string) => IllegalCharacters.has(key)

export const useKeyIsPressed = (key: Key): boolean => {
  const [keyPressed, setKeyPressed] = useState(false)

  const handleKeydown = (e) => {
    if (e.key === key.key) {
      setKeyPressed(true)
    }
  }

  const handleKeyup = (e) => {
    if (e.key === key.key) {
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
