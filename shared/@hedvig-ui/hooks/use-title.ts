import { DependencyList, useEffect, useRef } from 'react'

export const useTitle = (
  title: string,
  dependencies: DependencyList = [],
  retainOnUnmount = false,
) => {
  const defaultTitle = useRef(document.title)

  useEffect(() => {
    document.title = title
  }, [title, ...dependencies])

  useEffect(() => {
    return () => {
      if (!retainOnUnmount) {
        document.title = defaultTitle.current
      }
    }
  }, [])
}
