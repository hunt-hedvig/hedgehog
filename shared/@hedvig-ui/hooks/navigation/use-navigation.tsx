import { isPressing, Key, Keys } from '@hedvig-ui'
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { lightTheme } from '@hedvig-ui'
import chroma from 'chroma-js'
import { useLocation } from 'react-router'

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

  const { pathname } = useLocation()

  useEffect(() => {
    const autoFocusItem = Object.keys(registry.current).find(
      (name) => registry.current[name].autoFocus,
    )

    if (autoFocusItem) {
      setCursor(autoFocusItem)
      cursorRef.current = autoFocusItem
    }
  }, [pathname])

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

      if (options.metaKey && !e[options.metaKey]) {
        return
      }

      if (options?.focusedActions && name === cursorRef.current) {
        options.focusedActions.forEach((action) => {
          if (isPressing(e, action.key)) {
            action.action()
          }
        })

        return false
      }

      if (!options?.focus) {
        return false
      }

      if (
        isPressing(e, options.focus) &&
        (options.focusCondition ? options.focusCondition(name) : true)
      ) {
        setCursor(name)
        cursorRef.current = name
        if (
          cursorRef.current &&
          (registry.current[cursorRef.current].withFocus ||
            registry.current[cursorRef.current].focusTarget) &&
          'activeElement' in document
        ) {
          ;(document.activeElement as HTMLElement)?.blur()
        }
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
        (target.withFocus || target.focusTarget) &&
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
      if (cursorRef.current && (target.withFocus || target.focusTarget)) {
        const element = document.getElementById(
          target.focusTarget || cursorRef.current,
        )
        element?.focus()
        setCursor(null)
        cursorRef.current = null
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

      if (nextCursor) {
        setCursor(nextCursor)
        cursorRef.current = nextCursor

        return
      }

      setCursor(null)
    }

    const getNextCursor = (target: string | string[] | (() => string)) => {
      return typeof target === 'function'
        ? target()
        : typeof target === 'object' &&
          target.find((item: string) => registry.current[item])
        ? (target.find((item: string) => registry.current[item]) as string)
        : typeof target !== 'object'
        ? target
        : ''
    }

    if (isPressing(e, Keys.Up) && target?.neighbors?.up) {
      e.preventDefault()

      const nextCursor: string = getNextCursor(target.neighbors.up)

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
      const nextCursor: string = getNextCursor(target.neighbors.down)

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
      const nextCursor: string = getNextCursor(target.neighbors.left)

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
      const nextCursor: string = getNextCursor(target.neighbors.right)

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
  specifyId?: string
  focusedActions?: {
    key: Key
    action: () => void
  }[]
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
        id: options?.specifyId || name,
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

        if (ref && ref.nodeName === 'INPUT') {
          return
        }

        ref?.focus()
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
    isHorizontal,
    styles,
    edges,
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
    isHorizontal?: boolean
    edges?: {
      first?: string
      second?: string
    }
    styles?:
      | {
          focus?: React.CSSProperties
          basic?: React.CSSProperties
        }
      | ((item: T) => {
          focus?: React.CSSProperties
          basic?: React.CSSProperties
        })
  }) => {
    return {
      registerItem: (item: T) => {
        const listName = `${name} - ${item[nameField]}`

        const itemIndex = list
          .map((item) => item[nameField])
          .indexOf(item[nameField])

        const firstDirection = isHorizontal ? 'left' : 'up'
        const secondDirection = isHorizontal ? 'right' : 'down'

        return register(
          listName,
          {
            focus,
            resolve: () => {
              resolve?.(item)
            },
            neighbors: {
              [firstDirection]: itemIndex
                ? `${name} - ${list[itemIndex - 1][nameField]}`
                : edges?.first || undefined,
              [secondDirection]:
                itemIndex < list.length - 1
                  ? `${name} - ${list[itemIndex + 1][nameField]}`
                  : edges?.second || undefined,
            },
            focusCondition,
            withFocus,
            focusTarget,
            autoFocus: autoFocus ? itemIndex === 0 : false,
          },
          typeof styles === 'function' ? styles(item).focus : styles?.focus,
          typeof styles === 'function' ? styles(item).basic : styles?.basic,
        )
      },
    }
  }

  return {
    register,
    registerList,
  }
}
