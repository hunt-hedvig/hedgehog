import { useEffect, useState } from 'react'

export const useElementsInsideParent = (
  parentRef: React.RefObject<HTMLElement>,
  tag: keyof HTMLElementTagNameMap,
): HTMLElement[] => {
  const [elements, setElements] = useState<HTMLElement[]>([])

  useEffect(() => {
    if (!parentRef.current) {
      return
    }

    const buttonsHTMLCollection = parentRef.current.getElementsByTagName(tag)
    const buttonsList = Array.prototype.slice
      .call(buttonsHTMLCollection)
      .map((btn) => btn as HTMLElement)

    setElements(buttonsList)
  }, [parentRef.current])

  return elements
}
