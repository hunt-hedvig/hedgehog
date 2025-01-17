import React, { useEffect, useState } from 'react'

export interface Key {
  code: string
  codeAlternative?: string
  hint: string
}

export const Keys: { [name: string]: Key } = {
  Escape: {
    code: 'Escape',
    hint: 'Esc',
  },
  Backspace: {
    code: 'Backspace',
    hint: 'Backspace ⌫',
  },
  Tab: {
    code: 'Tab',
    hint: 'Tab ⇥',
  },
  Enter: {
    code: 'Enter',
    hint: 'Enter ↩',
  },
  Shift: {
    code: 'ShiftLeft',
    codeAlternative: 'ShiftRight',
    hint: 'Shift ⇧',
  },
  Control: {
    code: 'ControlLeft',
    codeAlternative: 'ControlRight',
    hint: 'Control ⌃',
  },
  Option: {
    code: 'AltLeft',
    codeAlternative: 'AltRight',
    hint: 'Option ⌥',
  },
  CapsLock: {
    code: 'CapsLock',
    hint: 'Caps ⇪',
  },
  Command: {
    code: 'MetaLeft',
    codeAlternative: 'MetaRight',
    hint: 'Command ⌘',
  },
  Space: {
    code: 'Space',
    hint: 'Space ␣',
  },
  Left: {
    code: 'ArrowLeft',
    hint: 'Left ←',
  },
  Up: {
    code: 'ArrowUp',
    hint: 'Up ↑',
  },
  Right: {
    code: 'ArrowRight',
    hint: 'Right →',
  },
  Down: {
    code: 'ArrowDown',
    hint: 'Down ↓',
  },
  Zero: {
    code: 'Digit0',
    hint: '0',
  },
  One: {
    code: 'Digit1',
    hint: '1',
  },
  Two: {
    code: 'Digit2',
    hint: '2',
  },
  Three: {
    code: 'Digit3',
    hint: '3',
  },
  Four: {
    code: 'Digit4',
    hint: '4',
  },
  Five: {
    code: 'Digit5',
    hint: '5',
  },
  Six: {
    code: 'Digit6',
    hint: '6',
  },
  Seven: {
    code: 'Digit7',
    hint: '7',
  },
  Eight: {
    code: 'Digit8',
    hint: '8',
  },
  Nine: {
    code: 'Digit9',
    hint: '9',
  },
  A: {
    code: 'KeyA',
    hint: 'A',
  },
  B: {
    code: 'KeyB',
    hint: 'B',
  },
  C: {
    code: 'KeyC',
    hint: 'C',
  },
  D: {
    code: 'KeyD',
    hint: 'D',
  },
  E: {
    code: 'KeyE',
    hint: 'E',
  },
  F: {
    code: 'KeyF',
    hint: 'F',
  },
  G: {
    code: 'KeyG',
    hint: 'G',
  },
  H: {
    code: 'KeyH',
    hint: 'H',
  },
  I: {
    code: 'KeyI',
    hint: 'I',
  },
  J: {
    code: 'KeyJ',
    hint: 'J',
  },
  K: {
    code: 'KeyK',
    hint: 'K',
  },
  L: {
    code: 'KeyL',
    hint: 'L',
  },
  M: {
    code: 'KeyM',
    hint: 'M',
  },
  N: {
    code: 'KeyN',
    hint: 'N',
  },
  O: {
    code: 'KeyO',
    hint: 'O',
  },
  P: {
    code: 'KeyP',
    hint: 'P',
  },
  Q: {
    code: 'KeyQ',
    hint: 'Q',
  },
  R: {
    code: 'KeyR',
    hint: 'R',
  },
  S: {
    code: 'KeyS',
    hint: 'S',
  },
  T: {
    code: 'KeyT',
    hint: 'T',
  },
  U: {
    code: 'KeyU',
    hint: 'U',
  },
  V: {
    code: 'KeyV',
    hint: 'V',
  },
  W: {
    code: 'KeyW',
    hint: 'W',
  },
  X: {
    code: 'KeyX',
    hint: 'X',
  },
  Y: {
    code: 'KeyY',
    hint: 'Y',
  },
  Z: {
    code: 'KeyZ',
    hint: 'Z',
  },
  F1: {
    code: 'F1',
    hint: 'F1',
  },
  F2: {
    code: 'F2',
    hint: 'F2',
  },
  F3: {
    code: 'F3',
    hint: 'F3',
  },
  F4: {
    code: 'F4',
    hint: 'F4',
  },
  F5: {
    code: 'F5',
    hint: 'F5',
  },
  F6: {
    code: 'F6',
    hint: 'F6',
  },
  F7: {
    code: 'F7',
    hint: 'F7',
  },
  F8: {
    code: 'F8',
    hint: 'F8',
  },
  F9: {
    code: 'F9',
    hint: 'F9',
  },
  F10: {
    code: 'F10',
    hint: 'F10',
  },
  F11: {
    code: 'F11',
    hint: 'F11',
  },
  F12: {
    code: 'F12',
    hint: 'F12',
  },
  Slash: {
    code: 'Slash',
    hint: '/',
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

export const isPressing = (
  e: React.KeyboardEvent | KeyboardEvent,
  key: Key | ReadonlyArray<Key> | ReadonlyArray<string>,
): boolean => {
  if (!('length' in key)) {
    return isPressingKey(e, key.code, key.codeAlternative)
  }

  if (typeof key[0] === 'string') {
    return isPressingKeys(e, key as ReadonlyArray<string>)
  }

  const codes = (key as ReadonlyArray<Key>).map((k) => k.code)
  return isPressingKeys(e, codes)
}

const isPressingKey = (
  e: React.KeyboardEvent | KeyboardEvent,
  code: string,
  codeAlternative?: string,
): boolean => e.code === code || e.code === codeAlternative

const isPressingKeys = (
  e: React.KeyboardEvent | KeyboardEvent,
  keys: ReadonlyArray<string>,
): boolean => {
  if (keys.length <= 1) {
    throw Error(
      'Illegal to use isPressingKeys with single key, use isPressing instead',
    )
  }
  const modifiers: string[] = []
  e.shiftKey && modifiers.push(Keys.Shift.code)
  e.ctrlKey && modifiers.push(Keys.Control.code)
  e.altKey && modifiers.push(Keys.Option.code)
  e.metaKey && modifiers.push(Keys.Command.code)
  if (modifiers.length !== keys.length - 1) {
    return false
  }
  return keys.reduce<boolean>((prev, current) => {
    return prev && (isPressingKey(e, current) || modifiers.includes(current))
  }, true)
}

export const useKeyIsPressed = (
  key: Key,
  callback?: (e: KeyboardEvent) => void,
): boolean => {
  const [keyPressed, setKeyPressed] = useState(false)

  const handleKeydown = (e: KeyboardEvent) => {
    if (isPressing(e, key)) {
      callback?.(e)
      setKeyPressed(true)
    }
  }

  const handleKeyup = (e: KeyboardEvent) => {
    if (isPressing(e, key)) {
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
