import { useEffect, useRef } from 'react'

export const useTitle = (
  title: string,
  dependencies: any[] | null = null,
  retainOnUnmount: boolean = false,
) => {
  const defaultTitle = useRef(document.title)

  useEffect(() => {
    document.title = title
  }, [title, dependencies])

  useEffect(() => {
    return () => {
      if (!retainOnUnmount) {
        document.title = defaultTitle.current
      }
    }
  }, [])
}
