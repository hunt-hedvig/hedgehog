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
import { lightTheme } from '@hedvig-ui'
import chroma from 'chroma-js'

interface NavigationContextProps {
  cursor: string | null
  setCursor: (focus: string | null) => void
  registry: Record<string, UseNavigationRegisterOptions>
  setRegistryItem: (
    name: string,
    options?: UseNavigationRegisterOptions,
  ) => void
  assignRef: (name: string, ref: unknown) => void
  removeRegistryItem: (name: string) => void
}

const NavigationContext = createContext<NavigationContextProps>({
  cursor: null,
  setCursor: () => void 0,
  registry: {},
  setRegistryItem: () => void 0,
  assignRef: () => void 0,
  removeRegistryItem: () => false,
})

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cursor, setCursor] = useState<string | null>(null)
  const cursorRef = useRef<string | null>(null)
  const registry = useRef<Record<string, UseNavigationRegisterOptions>>({})

  const validate = (name: string) => {
    if (!registry.current[name]) {
      console.warn(`[useNavigation] No item with name '${name}' found`)
      return false
    }

    return true
  }

  const handleKeydown = (e: KeyboardEvent) => {
    if (!(e.target instanceof Node)) {
      return
    }

    if (
      (e.target?.nodeName === 'INPUT' || e.target?.nodeName === 'TEXTAREA') &&
      e.code !== 'Escape' &&
      e.code !== 'Enter'
    ) {
      return
    }

    Object.keys(registry.current).some((name) => {
      const options = registry.current[name]

      if (
        !options.metaKey &&
        (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey)
      ) {
        return
      }

      if (!options?.focus) {
        return false
      }

      if (options.metaKey && !e[options.metaKey]) {
        return
      }

      if (
        isPressing(e, options.focus) &&
        (options.focusCondition ? options.focusCondition(name) : true)
      ) {
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
      if (
        cursorRef.current &&
        target.withFocus &&
        'activeElement' in document
      ) {
        ;(document.activeElement as HTMLElement)?.blur()
      }

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

      const nextCursor = cursorRef.current
        ? target.parent(registry.current[cursorRef.current].ref)
        : null
      setCursor(nextCursor)
      cursorRef.current = nextCursor

      return
    }

    if (isPressing(e, Keys.Enter)) {
      if (cursorRef.current && target.withFocus) {
        const element = document.getElementById(
          target.focusTarget || cursorRef.current,
        )
        element?.focus()
      }

      if (!target?.resolve) {
        return
      }

      if (typeof target.resolve === 'string') {
        if (!validate(target.resolve)) {
          return
        }

        setCursor(target.resolve)
        cursorRef.current = target.resolve
        return
      }

      const nextCursor = cursorRef.current
        ? target.resolve(registry.current[cursorRef.current].ref) ?? null
        : null

      setCursor(nextCursor)
      cursorRef.current = nextCursor

      return
    }

    if (isPressing(e, Keys.Up) && target?.neighbors?.up) {
      e.preventDefault()
      const nextCursor: string =
        typeof target.neighbors.up === 'function'
          ? target.neighbors.up()
          : typeof target.neighbors.up === 'object' &&
            target.neighbors.up.find((item) => registry.current[item])
          ? (target.neighbors.up.find(
              (item) => registry.current[item],
            ) as string)
          : typeof target.neighbors.up !== 'object'
          ? target.neighbors.up
          : ''

      if (!validate(nextCursor)) {
        return
      }

      if (target.onNavigation) {
        target.onNavigation(nextCursor, 'up')
      }

      setCursor(nextCursor)
      cursorRef.current = nextCursor
      return
    }

    if (isPressing(e, Keys.Down) && target?.neighbors?.down) {
      e.preventDefault()
      const nextCursor: string =
        typeof target.neighbors.down === 'function'
          ? target.neighbors.down()
          : typeof target.neighbors.down === 'object' &&
            target.neighbors.down.find((item) => registry.current[item])
          ? (target.neighbors.down.find(
              (item) => registry.current[item],
            ) as string)
          : typeof target.neighbors.down !== 'object'
          ? target.neighbors.down
          : ''

      if (!validate(nextCursor)) {
        return
      }

      if (target.onNavigation) {
        target.onNavigation(nextCursor, 'down')
      }

      setCursor(nextCursor)
      cursorRef.current = nextCursor
      return
    }

    if (isPressing(e, Keys.Left) && target?.neighbors?.left) {
      e.preventDefault()
      const nextCursor: string =
        typeof target.neighbors.left === 'function'
          ? target.neighbors.left()
          : typeof target.neighbors.left === 'object' &&
            target.neighbors.left.find((item) => registry.current[item])
          ? (target.neighbors.left.find(
              (item) => registry.current[item],
            ) as string)
          : typeof target.neighbors.left !== 'object'
          ? target.neighbors.left
          : ''

      if (!validate(nextCursor)) {
        return
      }

      if (target.onNavigation) {
        target.onNavigation(nextCursor, 'left')
      }

      setCursor(nextCursor)
      cursorRef.current = nextCursor
      return
    }

    if (isPressing(e, Keys.Right) && target?.neighbors?.right) {
      e.preventDefault()
      const nextCursor: string =
        typeof target.neighbors.right === 'function'
          ? target.neighbors.right()
          : typeof target.neighbors.right === 'object' &&
            target.neighbors.right.find((item) => registry.current[item])
          ? (target.neighbors.right.find(
              (item) => registry.current[item],
            ) as string)
          : typeof target.neighbors.right !== 'object'
          ? target.neighbors.right
          : ''

      if (!validate(nextCursor)) {
        return
      }

      if (target.onNavigation) {
        target.onNavigation(nextCursor, 'right')
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
    cursorRef.current = value
  }

  const handleSetRegistryItem = (
    name: string,
    options?: UseNavigationRegisterOptions,
  ) => {
    if (options && Object.keys(options).length !== 0) {
      registry.current[name] = options
    }
  }

  const removeRegistryItem = (name: string) => {
    delete registry.current[name]
  }

  const assignRef = (name: string, ref: unknown) => {
    if (!registry.current[name].ref) {
      registry.current[name].ref = ref
    }
  }

  return (
    <NavigationContext.Provider
      value={{
        cursor,
        setCursor: handleCursorChange,
        registry: registry.current,
        setRegistryItem: handleSetRegistryItem,
        removeRegistryItem,
        assignRef,
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

interface NodeNavigationDirections {
  up?: string | string[] | (() => string)
  down?: string | string[] | (() => string)
  left?: string | string[] | (() => string)
  right?: string | string[] | (() => string)
}

interface UseNavigationRegisterOptions {
  autoFocus?: boolean
  onNavigation?: (
    nextCursor: string,
    direction: 'up' | 'down' | 'left' | 'right',
  ) => void
  focus?: Key
  metaKey?: 'altKey' | 'ctrlKey' | 'metaKey' | 'shiftKey'
  resolve?: string | ((ref: unknown) => string | void)
  parent?: string | ((ref: unknown) => string)
  neighbors?: NodeNavigationDirections
  ref?: unknown
  focusCondition?: (item: string) => boolean
  withFocus?: boolean
  focusTarget?: string
}

export const useNavigation = () => {
  const {
    cursor,
    registry,
    setCursor,
    setRegistryItem,
    removeRegistryItem,
    assignRef,
  } = useContext(NavigationContext)

  const localItems = useRef<Record<string, UseNavigationRegisterOptions>>({})

  const registerItem = (
    name: string,
    options?: UseNavigationRegisterOptions,
  ) => {
    setRegistryItem(name, options)

    if (options && Object.keys(options).length !== 0) {
      localItems.current[name] = options
    }
  }

  useEffect(() => {
    if (cursor) {
      return
    }

    Object.keys(localItems.current).forEach((name) => {
      if (localItems.current[name].autoFocus) {
        setCursor(name)
      }
    })
  }, [cursor, localItems.current])

  const itemExists = (name: string) => !!registry[name]

  useEffect(() => {
    return () => {
      Object.keys(localItems.current).forEach((name) => {
        removeRegistryItem(name)
        delete localItems.current[name]
      })
    }
  }, [])

  const register = (
    name: string,
    options?: UseNavigationRegisterOptions,
    activeStyle?: React.CSSProperties,
    style?: React.CSSProperties,
  ) => {
    if (!itemExists(name)) {
      registerItem(name, options)
    }

    if (cursor !== name) {
      return {
        style: {
          border: '2px solid transparent',
          ...style,
        },
        id: name,
      }
    }

    return {
      style: {
        border: `2px solid ${chroma(lightTheme.accent).brighten(1).hex()}`,
        ...activeStyle,
      },
      // eslint-disable-next-line
      ref: (ref: any) => {
        assignRef(name, ref)

        ref?.scrollIntoView({
          inline: 'center',
          block: 'center',
          behavior: 'smooth',
        })
      },
      id: name,
    }
  }

  const registerList = <T,>({
    list,
    name,
    nameField,
    focus,
    resolve,
    focusCondition,
    withFocus,
    focusTarget,
    autoFocus,
  }: {
    list: T[]
    name: string
    nameField: keyof T
    focus?: Key
    resolve?: (item: T) => void
    focusCondition?: (itemName: string) => boolean
    withFocus?: boolean
    focusTarget?: string
    autoFocus?: boolean
  }) => {
    return {
      registerItem: (item: T) => {
        const listName = `${name} - ${item[nameField]}`

        const itemIndex = list
          .map((item) => item[nameField])
          .indexOf(item[nameField])

        return register(listName, {
          focus,
          resolve: () => {
            resolve?.(item)
          },
          neighbors: {
            up: itemIndex
              ? `${name} - ${list[itemIndex - 1][nameField]}`
              : undefined,
            down:
              itemIndex < list.length - 1
                ? `${name} - ${list[itemIndex + 1][nameField]}`
                : undefined,
          },
          focusCondition,
          withFocus,
          focusTarget,
          autoFocus: autoFocus ? list.indexOf(item) === 0 : false,
        })
      },
    }
  }

  return {
    register,
    registerList,
    focus: (name: string | null) => setCursor(name),
  }
}
