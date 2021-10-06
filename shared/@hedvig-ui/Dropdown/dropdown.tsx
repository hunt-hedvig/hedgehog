import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import React, { LiHTMLAttributes, useEffect, useRef } from 'react'
import { X } from 'react-bootstrap-icons'
import { useClickOutside } from '../utils/click-outside'
import { Keys } from '../utils/key-press-hook'
import { sleep } from '../utils/sleep'

const show = keyframes`
  from {
    opacity: 0;
    transform: translate(0, -50px);
  }

  to {
    opacity: 1;
    transform: translate(0, 0);
  }
`

const close = keyframes`
  from {
    opacity: 1;
    transform: translate(0, 0);
  }

  to {
    opacity: 0;
    transform: translate(0, -50px);
  }
`

const DropdownStyled = styled.div<{ active: boolean }>`
  position: relative;
  & ul,
  & li {
    list-style: none;
  }

  & > li:first-of-type {
    border-radius: 0.3rem;
    border: 1px solid ${({ theme }) => theme.border};

    ${({ active }) =>
      active &&
      `
    border-bottom: none;
    border-radius: 0.3rem 0.3rem 0 0;
  `}
  }
`

const OptionsList = styled.ul<{ closing: boolean }>`
  margin: 0;
  padding-left: 0;

  position: absolute;
  width: 100%;

  animation: ${({ closing }) => (!closing ? show : close)} 0.1s linear;
  background-color: ${({ theme }) => theme.backgroundLight};
  border-radius: 0 0 0.3rem 0.3rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-top: none;
  box-shadow: 0 5px 40px ${({ theme }) => theme.backgroundTransparent};

  & li:last-of-type {
    border-radius: 0 0 0.3rem 0.3rem;
  }
`

const OptionStyled = styled.li<{ selected: boolean }>`
  display: flex;
  align-items: center;

  overflow: hidden;

  outline: none;
  cursor: pointer;
  padding: 10px 25px;
  background-color: ${({ theme, selected }) =>
    !selected ? theme.backgroundLight : theme.accentBackground};

  &:hover,
  &:focus {
    background-color: ${({ theme, selected }) =>
      !selected ? theme.accentBackground : theme.background};
  }
`

const Tag = styled.div`
  white-space: nowrap;

  font-size: 14px;
  height: 24px;

  display: flex;
  align-items: center;

  padding: 0 10px;
  border-radius: 0.25rem;
  background-color: ${({ theme }) => theme.accentBackground};

  &:not(:last-child) {
    margin-right: 5px;
  }
`

const Placeholder = styled.span`
  color: ${({ theme }) => theme.placeholderColor};
`

const ClearIcon = styled(X)`
  width: 45px;
  height: calc(100% - 2px);

  position: absolute;
  right: 1px;
  top: 1px;

  padding: 0.2rem;
  background-color: ${({ theme }) => theme.backgroundLight};
  border-radius: 0.2rem;

  cursor: pointer;
`

interface DropdownProps {
  placeholder?: string
  children: any
}

export const Dropdown: React.FC<DropdownProps> = ({
  placeholder,
  children,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [selectedIdx, setSelectedIdx] = React.useState(0)
  const [active, setActive] = React.useState(false)
  const [closing, setClosing] = React.useState(false)

  const closeDropdown = async () => {
    setClosing(true)
    await sleep(90)
    setClosing(false)
    setActive(false)
  }

  const toggleDropdown = async () => {
    if (active) {
      await closeDropdown()
      return
    }

    setActive(true)
  }

  useClickOutside(dropdownRef, closeDropdown)

  useEffect(() => {
    children.forEach((el, index) => {
      if (el.props.selected) {
        setSelectedIdx(index + 1)
      }
    })
  }, [children])

  return (
    <DropdownStyled
      ref={dropdownRef}
      active={active}
      onKeyDown={(e) => {
        if (e.keyCode === Keys.Escape.code) {
          toggleDropdown()
          return
        }
      }}
    >
      {!selectedIdx ? (
        <OptionStyled
          selected={false}
          tabIndex={0}
          onClick={toggleDropdown}
          onKeyDown={(e) => {
            if (e.keyCode === Keys.Enter.code) {
              toggleDropdown()
              return
            }
          }}
        >
          <Placeholder>{placeholder || 'Dropdown'}</Placeholder>
        </OptionStyled>
      ) : (
        {
          ...children[selectedIdx - 1],
          props: {
            ...children[selectedIdx - 1].props,
            selected: false,
            onClick: () => {
              children[selectedIdx - 1].props.onClick()
              toggleDropdown()
            },
          },
        }
      )}

      {active && (
        <OptionsList closing={closing}>
          {children.map((el) => ({
            ...el,
            props: {
              ...el.props,
              onClick: () => {
                el.props.onClick()
                toggleDropdown()
              },
            },
          }))}
        </OptionsList>
      )}
    </DropdownStyled>
  )
}

export interface OptionProps
  extends Omit<LiHTMLAttributes<HTMLLIElement>, 'onClick'> {
  onClick: () => void
  selected: boolean
}

export const Option: React.FC<OptionProps> = ({
  children,
  onClick,
  ...props
}) => (
  <OptionStyled
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.keyCode === Keys.Enter.code) {
        onClick()
        return
      }
    }}
    onClick={onClick}
    {...props}
  >
    {children}
  </OptionStyled>
)

interface MultiDropdownProps {
  placeholder?: string
  options: string[]
  selected: any
  selectHandler: (opt: string) => void
  clearHandler?: () => void
}

export const MultiDropdown: React.FC<MultiDropdownProps> = ({
  placeholder,
  options,
  selected,
  selectHandler,
  clearHandler,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [active, setActive] = React.useState(false)
  const [closing, setClosing] = React.useState(false)

  const closeDropdown = async () => {
    setClosing(true)
    await sleep(90)
    setClosing(false)
    setActive(false)
  }

  const toggleDropdown = async () => {
    if (active) {
      await closeDropdown()
      return
    }

    setActive(true)
  }

  useClickOutside(dropdownRef, closeDropdown)

  return (
    <DropdownStyled
      ref={dropdownRef}
      active={active}
      onKeyDown={(e) => {
        if (e.keyCode === Keys.Escape.code) {
          toggleDropdown()
          return
        }
      }}
    >
      <OptionStyled
        tabIndex={0}
        onClick={toggleDropdown}
        onKeyDown={(e) => {
          if (e.keyCode === Keys.Enter.code) {
            toggleDropdown()
            return
          }
        }}
        selected={false}
      >
        {placeholder && !selected?.length ? (
          <Placeholder>{placeholder}</Placeholder>
        ) : selected?.length ? (
          selected.map((opt) => <Tag>{opt}</Tag>)
        ) : (
          <Placeholder>Dropdown</Placeholder>
        )}
      </OptionStyled>

      {active && (
        <OptionsList closing={closing}>
          {options.map((opt) => (
            <Option
              selected={selected?.includes(opt) || false}
              onClick={() => {
                selectHandler(opt)
                toggleDropdown()
              }}
            >
              {opt}
            </Option>
          ))}
        </OptionsList>
      )}
      {!!selected?.length && clearHandler ? (
        <ClearIcon onClick={clearHandler} />
      ) : null}
    </DropdownStyled>
  )
}
