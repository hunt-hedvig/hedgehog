import styled from '@emotion/styled'
import { Popover } from '@hedvig-ui'
import React, { useEffect, useState } from 'react'
import { Link45deg } from 'react-bootstrap-icons'

const CopyableWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
  justify-content: center;

  .link-icon {
    background-color: ${({ theme }) => theme.backgroundTransparent};
    border-radius: 6px;
    font-size: 1.1em;
    opacity: 1;
  }

  .component {
    margin-right: 0.25em;
  }

  .link-icon:hover {
    cursor: pointer;
  }
`

interface PopoverLabel {
  before?: string
  after?: string
}

export const Copyable: React.FC<{
  children: React.ReactNode
  onClick: () => void
  icon?: boolean
  copyLabel?: PopoverLabel
}> = ({ copyLabel, children, onClick, icon = false }) => {
  const [copied, setCopied] = useState(false)

  const { before = 'Copy', after = 'Copied!' } = copyLabel ?? {}

  useEffect(() => {
    setTimeout(() => setCopied(false), 1000)
  }, [copied])

  const handleCopy = () => {
    onClick()
    setCopied(true)
  }

  if (icon) {
    return (
      <CopyableWrapper onMouseLeave={() => setCopied(false)}>
        <Popover contents={copied ? after : before}>
          <div className="component" onClick={() => !icon && handleCopy()}>
            {children}
          </div>
        </Popover>
      </CopyableWrapper>
    )
  }

  return (
    <CopyableWrapper onMouseLeave={() => setCopied(false)}>
      <div className="component" onClick={() => !icon && handleCopy()}>
        {children}
      </div>
      <Popover contents={copied ? after : before}>
        <Link45deg onClick={handleCopy} className="link-icon" />
      </Popover>
    </CopyableWrapper>
  )
}
