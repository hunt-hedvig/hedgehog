import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import React, { useEffect, useRef } from 'react'
import { X } from 'react-bootstrap-icons'
import { isPressing, Keys } from '../hooks/keyboard/use-key-is-pressed'
import { useNavigation } from '../hooks/navigation/use-navigation'
import { useClickOutside } from '../hooks/use-click-outside'

const show = keyframes`
  from {
    opacity: 0;
    top: 0;
  }

  to {
    opacity: 1;
    top: calc(100% + 1px);
  }
`

const StyledDropdown = styled.div<{ active?: boolean }>`
  position: relative;

  display: flex;
  align-items: center;

  border-radius: 0.3rem 0.3rem
    ${({ active }) => (!active ? '0.3rem 0.3rem' : '0 0')};
  padding: 5px;
  background-color: ${({ theme }) => theme.backgroundLight};
  border: 1px solid ${({ theme }) => theme.border};
  cursor: pointer;
  outline: none;

  .placeholder {
    color: ${({ theme }) => theme.placeholderColor};
  }

  &:focus {
    border: 1px solid ${({ theme }) => theme.accent};
  }
`

const Selected = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;

  flex-wrap: wrap;
  overflow: hidden;

  gap: 5px 5px;
`

const OptionsList = styled.ul`
  margin: 0;
  padding: 0;

  background-color: ${({ theme }) => theme.backgroundLight};
  box-shadow: 0px 9px 8px 0px ${({ theme }) => theme.backgroundTransparent};
  width: calc(100% + 2px);
  animation: ${show} 0.1s linear;

  position: absolute;
  z-index: 2;
  top: calc(100% + 1px);
  left: -1px;

  &,
  & li:last-of-type {
    border-radius: 0 0 0.3rem 0.3rem;
  }
`

const Option = styled.li<{ selected?: boolean }>`
  padding: 5px 15px;
  list-style: none;
  outline: none;
  background-color: ${({ theme, selected }) =>
    !selected ? theme.backgroundLight : theme.accentBackground};

  &:hover,
  &:focus {
    background-color: ${({ theme, selected }) =>
      !selected ? theme.accentBackground : theme.background};
  }
`

const Tag = styled.span`
  height: 100%;
  padding: 0 10px;

  display: flex;
  align-items: center;

  border-radius: 0.3rem;
  background-color: ${({ theme }) => theme.accentLighter};
`

const CloseIcon = styled(X)`
  width: 25px;
  height: 25px;
  position: absolute;
  right: -2rem;
  cursor: pointer;
`

interface DropdownProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: string[]
  placeholder?: string
  value: string[] | null
  onChange: (opt: string) => void
  clearHandler: () => void
  open?: boolean
}

export const MultiDropdown: React.FC<DropdownProps> = ({
  options,
  placeholder,
  onChange,
  value,
  clearHandler,
  open,
  ...props
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = React.useState(open || false)

  const { register } = useNavigation()

  useClickOutside(dropdownRef, () => setActive(false))

  useEffect(() => {
    setActive(open || false)
  }, [open])

  return (
    <StyledDropdown
      ref={dropdownRef}
      tabIndex={0}
      active={active}
      onClick={() => !value?.length && setActive(true)}
      onKeyDown={(e) => {
        if (isPressing(e, Keys.Enter) && !value?.length) {
          setActive(true)
          return
        }
        if (isPressing(e, Keys.Escape)) {
          setActive(false)
          return
        }
      }}
      {...props}
    >
      {value && !!value.length ? (
        <>
          <Selected onClick={() => setActive((prev) => !prev)}>
            {value.map((opt) => (
              <Tag key={opt}>{opt}</Tag>
            ))}
          </Selected>
          <CloseIcon onClick={clearHandler} />
        </>
      ) : (
        <span className="placeholder">{placeholder || 'Dropdown'}</span>
      )}
      {active && (
        <OptionsList>
          {options.map((opt, index) => {
            const navigation = register(opt, {
              resolve: () => {
                setActive(false)
                onChange(opt)
              },
              neighbors: {
                up: index ? options[index - 1] : undefined,
                down:
                  index < options.length - 1 ? options[index + 1] : undefined,
              },
            })

            return (
              <Option
                key={opt}
                selected={value?.includes(opt)}
                tabIndex={0}
                onClick={() => {
                  onChange(opt)
                }}
                onKeyDown={(e) => {
                  if (isPressing(e, Keys.Enter)) {
                    onChange(opt)
                    return
                  }
                }}
                {...navigation}
              >
                {opt}
              </Option>
            )
          })}
        </OptionsList>
      )}
    </StyledDropdown>
  )
}
