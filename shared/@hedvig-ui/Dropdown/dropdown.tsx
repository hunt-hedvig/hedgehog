import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import React, { LiHTMLAttributes, useEffect, useRef } from 'react'
import { useClickOutside } from '../utils/click-outside'
import { Keys } from '../utils/key-press-hook'

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

const DropdownStyled = styled.div<{ active: boolean }>`
  position: relative;
  outline: none;

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

  &:focus {
    & > li:first-of-type {
      background-color: ${({ theme }) => theme.accentBackground};
    }
  }
`

const OptionsList = styled.ul`
  margin: 0;
  padding-left: 0;

  position: absolute;
  z-index: 1000;
  width: 100%;

  animation: ${show} 0.1s linear;
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
  padding: 10px 15px;
  background-color: ${({ theme, selected }) =>
    !selected ? theme.backgroundLight : theme.accentBackground};

  &:hover,
  &:focus {
    background-color: ${({ theme, selected }) =>
      !selected ? theme.accentBackground : theme.background};
  }
`

const Placeholder = styled.span`
  color: ${({ theme }) => theme.placeholderColor};
`

interface DropdownProps {
  focus?: boolean
  placeholder?: string
  children: any
}

export const Dropdown: React.FC<DropdownProps> = ({
  focus,
  placeholder,
  children,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [selectedIdx, setSelectedIdx] = React.useState(0)
  const [active, setActive] = React.useState(false)

  const closeDropdown = async () => {
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
    if (focus && dropdownRef.current) {
      dropdownRef.current.focus()
    }
  }, [focus])

  useEffect(() => {
    children.forEach((el, index) => {
      if (el.props.selected) {
        setSelectedIdx(index + 1)
      }
    })
  }, [children])

  return (
    <DropdownStyled
      tabIndex={0}
      ref={dropdownRef}
      active={active}
      onKeyDown={(e) => {
        if (e.keyCode === Keys.Escape.code || e.keyCode === Keys.Enter.code) {
          toggleDropdown()
          return
        }
      }}
    >
      {!selectedIdx ? (
        <OptionStyled selected={false} tabIndex={-1} onClick={toggleDropdown}>
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
        <OptionsList>
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
