import {
  isPressing,
  Key,
  Keys,
} from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

interface NavigationContextProps {
  cursor: string | null
  setCursor: (focus: string | null) => void
  registry: Record<string, UseNavigationRegisterOptions>
  setRegistryItem: (name: string, options: UseNavigationRegisterOptions) => void
  removeRegistryItem: (name: string) => void
}

const NavigationContext = createContext<NavigationContextProps>({
  cursor: null,
  setCursor: (_: string | null) => void 0,
  registry: {},
  setRegistryItem: (_: string, __) => void 0,
  removeRegistryItem: (_: string) => false,
})

export const NavigationProvider = ({ children }) => {
  const [cursor, setCursor] = useState<string | null>(null)
  const cursorRef = useRef<string | null>(null)
  const registry = useRef<Record<string, UseNavigationRegisterOptions>>({})

  const validate = (name: string) => {
    if (!registry.current[name]) {
      console.error(`[useNavigation] No item with name '${name}' found`)
      return false
    }

    return true
  }

  const handleKeydown = (e) => {
    if (e.target?.nodeName === 'INPUT' || e.target?.nodeName === 'TEXTAREA') {
      return
    }

    Object.keys(registry.current).some((name) => {
      const options = registry.current[name]

      if (!options?.focus) {
        return false
      }

      if (isPressing(e, options.focus)) {
        setCursor(name)
        cursorRef.current = name
        return true
      }

      return false
    })

    const target = cursorRef.current
      ? registry.current[cursorRef.current]
      : null

    if (!target) {
      return
    }

    if (isPressing(e, Keys.Escape)) {
      if (!target?.parent) {
        setCursor(null)
        cursorRef.current = null
        return
      }

      if (typeof target.parent === 'string') {
        setCursor(target.parent)
        cursorRef.current = target.parent
        return
      }

      const nextCursor = target.parent()
      setCursor(nextCursor)
      cursorRef.current = nextCursor

      return
    }

    if (isPressing(e, Keys.Enter)) {
      if (typeof target.resolve === 'string') {
        if (!validate(target.resolve)) {
          return
        }

        setCursor(target.resolve)
        cursorRef.current = target.resolve
        return
      }

      const nextCursor = target.resolve() ?? null
      setCursor(nextCursor)
      cursorRef.current = nextCursor

      return
    }

    if (isPressing(e, Keys.Up) && target?.neighbors?.up) {
      e.preventDefault()
      const nextCursor =
        typeof target.neighbors.up === 'function'
          ? target.neighbors.up()
          : target.neighbors.up

      if (!validate(nextCursor)) {
        return
      }

      setCursor(nextCursor)
      cursorRef.current = nextCursor
      return
    }

    if (isPressing(e, Keys.Down) && target?.neighbors?.down) {
      e.preventDefault()
      const nextCursor =
        typeof target.neighbors.down === 'function'
          ? target.neighbors.down()
          : target.neighbors.down

      if (!validate(nextCursor)) {
        return
      }

      setCursor(nextCursor)
      cursorRef.current = nextCursor
      return
    }

    if (isPressing(e, Keys.Left) && target?.neighbors?.left) {
      e.preventDefault()
      const nextCursor =
        typeof target.neighbors.left === 'function'
          ? target.neighbors.left()
          : target.neighbors.left

      if (!validate(nextCursor)) {
        return
      }

      setCursor(nextCursor)
      cursorRef.current = nextCursor
      return
    }

    if (isPressing(e, Keys.Right) && target?.neighbors?.right) {
      e.preventDefault()
      const nextCursor =
        typeof target.neighbors.right === 'function'
          ? target.neighbors.right()
          : target.neighbors.right

      if (!validate(nextCursor)) {
        return
      }

      setCursor(nextCursor)
      cursorRef.current = nextCursor
      return
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown)
    return () => {
      window.removeEventListener('keydown', handleKeydown)
    }
  }, [])

  const handleCursorChange = (value: string | null) => {
    setCursor(value)
  }

  const handleSetRegistryItem = (
    name: string,
    options: UseNavigationRegisterOptions,
  ) => {
    registry.current[name] = options
  }

  const removeRegistryItem = (name: string) => {
    delete registry.current[name]
  }

  return (
    <NavigationContext.Provider
      value={{
        cursor,
        setCursor: handleCursorChange,
        registry: registry.current,
        setRegistryItem: handleSetRegistryItem,
        removeRegistryItem,
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

interface NodeNavigationDirections {
  up?: string | (() => string)
  down?: string | (() => string)
  left?: string | (() => string)
  right?: string | (() => string)
}

interface UseNavigationRegisterOptions {
  focus?: Key
  resolve: string | (() => string | void)
  parent?: string | (() => string)
  neighbors?: NodeNavigationDirections
}

export const useNavigation = () => {
  const { cursor, registry, setRegistryItem, removeRegistryItem } = useContext(
    NavigationContext,
  )
  const localItems = useRef<Record<string, UseNavigationRegisterOptions>>({})

  const registerItem = (
    name: string,
    options: UseNavigationRegisterOptions,
  ) => {
    setRegistryItem(name, options)
    localItems.current[name] = options
  }

  const itemExists = (name: string) => !!registry[name]

  useEffect(() => {
    return () => {
      Object.keys(localItems.current).forEach((name) => {
        removeRegistryItem(name)
        delete localItems.current[name]
      })
    }
  }, [])

  return {
    register: (name: string, options: UseNavigationRegisterOptions) => {
      if (!itemExists(name)) {
        registerItem(name, options)
      }

      if (cursor !== name) {
        return {}
      }

      return { style: { border: '2px solid blue' } }
    },
  }
}
