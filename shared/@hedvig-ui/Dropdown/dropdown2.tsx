import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import React, { LiHTMLAttributes, useEffect } from 'react'
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

  & > li:first-child {
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
  position: absolute;
  width: 100%;

  animation: ${({ closing }) => (!closing ? show : close)} 0.1s linear;
  padding: 15px;
  background-color: ${({ theme }) => theme.backgroundLight};
  border-radius: 0 0 0.3rem 0.3rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-top: none;
  box-shadow: 0 5px 40px ${({ theme }) => theme.backgroundTransparent};

  & li:not(:first-child) {
    margin-top: 1rem;
  }
`

const OptionStyled = styled.li`
  outline: none;
  cursor: pointer;
  padding: 10px 25px;
  border-radius: 0.3rem;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.backgroundLight};

  &:hover,
  &:focus {
    background-color: ${({ theme }) => theme.accentBackground};
  }
`

interface DropdownProps {
  title?: string
  children: any
}

export const Dropdown: React.FC<DropdownProps> = ({ title, children }) => {
  const [selectedIdx, setSelectedIdx] = React.useState()
  const [active, setActive] = React.useState(false)
  const [closing, setClosing] = React.useState(false)

  const toggleDropdown = async () => {
    if (active) {
      setClosing(true)
      await sleep(90)
      setClosing(false)
      setActive(false)
      return
    }

    setActive(true)
  }

  useEffect(() => {
    children.forEach((el, index) => {
      if (el.props.selected) {
        setSelectedIdx(index + 1)
      }
    })

    console.log(children)
  }, [children])

  return (
    <DropdownStyled
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
            onClick: () => {
              children[selectedIdx - 1].props.onClick()
              toggleDropdown()
            },
          },
        }
      )}

      {active && (
        <OptionsList closing={closing}>
          {children.map((el) => {
            const newEl = {
              ...el,
              props: {
                ...el.props,
                onClick: () => {
                  el.props.onClick()
                  toggleDropdown()
                },
              },
            }

            return newEl
          })}
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
