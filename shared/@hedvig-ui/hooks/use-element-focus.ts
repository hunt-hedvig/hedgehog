import React, { useEffect } from 'react'

export const useElementFocus = (
  ref: React.RefObject<HTMLElement>,
  focus?: boolean,
) => {
  useEffect(() => {
    if (!ref.current) {
      return
    }

    if (focus) {
      ref.current.focus()

      if (ref.current.scrollIntoView) {
        ref.current.scrollIntoView({
          block: 'center',
        })
      }

      return
    }

    ref.current.blur()
  }, [focus])
}
