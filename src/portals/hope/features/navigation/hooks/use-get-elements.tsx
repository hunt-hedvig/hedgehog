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

    const elementsHTMLCollection = parentRef.current.getElementsByTagName(tag)
    const elementsList = Array.prototype.slice
      .call(elementsHTMLCollection)
      .map((btn) => btn as HTMLElement)

    setElements(elementsList)
  }, [parentRef.current])

  return elements
}
