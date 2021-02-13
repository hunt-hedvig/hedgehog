import { useEffect, useState } from 'react'

export const OPTION_KEY_CODE = 18
export const Q_KEY_CODE = 81
export const W_KEY_CODE = 87
export const R_KEY_CODE = 82
export const T_KEY_CODE = 84
export const A_KEY_CODE = 65
export const S_KEY_CODE = 83
export const D_KEY_CODE = 68
export const G_KEY_CODE = 71
export const L_KEY_CODE = 76
export const C_KEY_CODE = 67
export const M_KEY_CODE = 77
export const ONE_KEY_CODE = 49
export const TWO_KEY_CODE = 50
export const THREE_KEY_CODE = 51
export const FOUR_KEY_CODE = 52
export const FIVE_KEY_CODE = 53
export const SIX_KEY_CODE = 54
export const SEVEN_KEY_CODE = 55
export const EIGHT_KEY_CODE = 56
export const NINE_KEY_CODE = 57
export const BACKSPACE_KEY_CODE = 8
export const ENTER_KEY_CODE = 13

export const useKeyPressed = (keyCode: number): boolean => {
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
