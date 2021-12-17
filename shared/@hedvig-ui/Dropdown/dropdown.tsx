import { css, keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import React, {
  HTMLAttributes,
  LiHTMLAttributes,
  useEffect,
  useRef,
} from 'react'
import { TriangleFill } from 'react-bootstrap-icons'
import { isPressing, Keys } from '../hooks/keyboard/use-key-is-pressed'
import { useVerticalKeyboardNavigation } from '../hooks/keyboard/use-vertical-keyboard-navigation'
import { useClickOutside } from '../hooks/use-click-outside'

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

const DropdownStyled = styled.div<{ isActive: boolean }>`
  width: 100%;
  position: relative;
  outline: none;

  & ul,
  & li {
    list-style: none;
  }

  & > li:first-of-type {
    border-radius: 0.3rem;
    border: 1px solid ${({ theme }) => theme.border};
    padding-right: 30px;

    ${({ isActive }) =>
      isActive &&
      `
        border-radius: 0.3rem 0.3rem 0 0;
        border-bottom: 1px solid transparent;
      `}
  }

  &:focus {
    & > li:first-of-type {
      background-color: ${({ theme }) => theme.accentBackground};
    }
  }
`

const OptionsList = styled.ul<{ activeOption: number }>`
  margin: 0;
  padding-left: 0;

  position: absolute;
  z-index: 1000;
  width: 100%;
  max-height: 500px;
  overflow-y: auto;

  animation: ${show} 0.1s linear;
  background-color: ${({ theme }) => theme.backgroundLight};
  border-radius: 0 0 0.3rem 0.3rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-top: none;
  box-shadow: 0 5px 40px ${({ theme }) => theme.backgroundTransparent};

  & li:last-of-type {
    border-radius: 0 0 0.3rem 0.3rem;
  }

  ${({ activeOption, theme }) => {
    if (activeOption !== -1) {
      return css`
        li:nth-of-type(${activeOption + 1}) {
          background-color: ${theme.accentLighter};
        }
      `
    }
  }}
`

const OptionStyled = styled.li<{ selected: boolean }>`
  display: flex;
  align-items: center;

  overflow: hidden;

  font-size: 14px;

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
  font-size: 14px;
  color: ${({ theme }) => theme.placeholderColor};
`

const TriangleIcon = styled(TriangleFill)<{ active: number }>`
  transition: all 0.2s;
  position: absolute;
  right: 15px;
  top: 40%;
  width: 10px;
  height: 10px;
  transform: scaleY(${({ active }) => active});
  color: ${({ active, theme }) =>
    active < 0 ? theme.placeholderColor : theme.accent};
`

export interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
  focus?: boolean
  placeholder?: string
  value?: string
  children: any
}

export const Dropdown: React.FC<DropdownProps> = ({
  focus,
  placeholder,
  children,
  value,
  ...props
}) => {
  const numberOfOptions = React.Children.count(children)

  const dropdownRef = useRef<HTMLDivElement>(null)

  const [selectedIdx, setSelectedIdx] = React.useState(0)
  const [active, setActive] = React.useState(false)

  const [navigationStep] = useVerticalKeyboardNavigation({
    maxStep: numberOfOptions - 1,
    onPerformNavigation: (index) => {
      children[index].props.onClick()
    },
    isActive: active,
  })

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
    const hasSelected = !!children.filter((el) => el.props.selected).length

    if (hasSelected) {
      children.forEach((el, index) => {
        if (el.props.selected) {
          setSelectedIdx(index + 1)
        }
      })
    } else {
      setSelectedIdx(0)
    }
  }, [children])

  useEffect(() => {
    if (navigationStep === -1) {
      setActive(false)
    }
  }, [navigationStep])

  return (
    <DropdownStyled
      tabIndex={0}
      ref={dropdownRef}
      isActive={active}
      onKeyDown={(e) => {
        if (isPressing(e, Keys.Enter)) {
          toggleDropdown()
          return
        }
        if (isPressing(e, Keys.Enter)) {
          closeDropdown()
          return
        }
      }}
      {...props}
    >
      {!selectedIdx || !children[selectedIdx - 1] ? (
        <OptionStyled selected={false} tabIndex={-1} onClick={toggleDropdown}>
          <Placeholder>{placeholder || 'Dropdown'}</Placeholder>
        </OptionStyled>
      ) : !value ? (
        {
          ...children[selectedIdx - 1],
          props: {
            ...children[selectedIdx - 1].props,
            tabIndex: -1,
            selected: false,
            onClick: () => {
              toggleDropdown()
            },
          },
        }
      ) : (
        <OptionStyled selected={false} tabIndex={-1} onClick={toggleDropdown}>
          {value}
        </OptionStyled>
      )}

      {active && (
        <OptionsList activeOption={navigationStep}>
          {children.map((el) => ({
            ...el,
            props: {
              ...el.props,
              tabIndex: -1,
              onClick: () => {
                el.props.onClick()
                toggleDropdown()
              },
            },
          }))}
        </OptionsList>
      )}

      <TriangleIcon active={active ? 1 : -1} />
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
      if (isPressing(e, Keys.Enter)) {
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
