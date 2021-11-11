import { useEffect, useState } from 'react'

export interface Key {
  key?: string
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
    key: 'Option',
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

export const KeyCodes: { [code: number]: Key } = {
  27: Keys.Escape,
  8: Keys.Backspace,
  9: Keys.Tab,
  13: Keys.Enter,
  16: Keys.Shift,
  17: Keys.Control,
  18: Keys.Option,
  20: Keys.CapsLock,
  91: Keys.Command,
  32: Keys.Space,
  37: Keys.Left,
  38: Keys.Up,
  39: Keys.Right,
  40: Keys.Down,
  48: Keys.Zero,
  49: Keys.One,
  50: Keys.Two,
  51: Keys.Three,
  52: Keys.Four,
  53: Keys.Five,
  54: Keys.Six,
  55: Keys.Seven,
  56: Keys.Eight,
  57: Keys.Nine,
  65: Keys.A,
  66: Keys.B,
  67: Keys.C,
  68: Keys.D,
  69: Keys.E,
  70: Keys.F,
  71: Keys.G,
  72: Keys.H,
  73: Keys.I,
  74: Keys.J,
  75: Keys.K,
  76: Keys.L,
  77: Keys.M,
  78: Keys.N,
  79: Keys.O,
  80: Keys.P,
  81: Keys.Q,
  82: Keys.R,
  83: Keys.S,
  84: Keys.T,
  85: Keys.U,
  86: Keys.V,
  87: Keys.W,
  88: Keys.X,
  89: Keys.Y,
  90: Keys.Z,
  112: Keys.F1,
  113: Keys.F2,
  114: Keys.F3,
  115: Keys.F4,
  116: Keys.F5,
  117: Keys.F6,
  118: Keys.F7,
  119: Keys.F8,
  120: Keys.F9,
  121: Keys.F10,
  122: Keys.F11,
  123: Keys.F12,
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
