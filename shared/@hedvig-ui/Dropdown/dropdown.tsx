import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import React, { LiHTMLAttributes, useEffect, useRef } from 'react'
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
  outline: none;
  cursor: pointer;
  padding: 10px 25px;
  background-color: ${({ theme, selected }) =>
    !selected ? theme.backgroundLight : theme.accentBackground};

  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  &:hover,
  &:focus {
    background-color: ${({ theme, selected }) =>
      !selected ? theme.accentBackground : theme.background};
  }
`

interface DropdownProps {
  title?: string
  children: any
}

export const Dropdown: React.FC<DropdownProps> = ({ title, children }) => {
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
          {title || 'Dropdown'}
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
  title?: string
  options: string[]
  selected: string[]
  selectHandler: (opt: string) => void
}

export const MultiDropdown: React.FC<MultiDropdownProps> = ({
  title,
  options,
  selected,
  selectHandler,
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
        {title && !selected?.length
          ? title
          : selected?.length
          ? selected.map((opt, idx) => (
              <span>
                {opt}
                {idx !== selected.length - 1 && ', '}
              </span>
            ))
          : 'Dropdown'}
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
    </DropdownStyled>
  )
}
