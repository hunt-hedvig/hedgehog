import styled from '@emotion/styled'
import { Popover } from 'hedvig-ui/popover'
import React, { useState } from 'react'
import { Link45deg } from 'react-bootstrap-icons'

const CopyableWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
  justify-content: center;

  .link-icon {
    transition: all 300ms;
    background-color: ${({ theme }) => theme.backgroundTransparent};
    border-radius: 6px;
    font-size: 1.1em;
    opacity: 0;
  }

  .component {
    transition: all 300ms;
    margin-right: -1em;
  }

  :hover {
    transition: all 300ms;
    .component {
      transition: all 300ms;
      margin-right: 0.25em;
    }
    .link-icon {
      transition: all 300ms;
      font-size: 1.1em;
      opacity: 1;
    }
    .link-icon:hover {
      cursor: pointer;
    }
  }
`

interface PopoverLabel {
  before?: string
  after?: string
}

export const Copyable: React.FC<{
  children: React.ReactNode
  onClick: () => void
  copyLabel?: PopoverLabel
}> = ({ copyLabel, children, onClick }) => {
  const [copied, setCopied] = useState(false)

  const { before = 'Copy', after = 'Copied!' } = copyLabel ?? {}

  return (
    <CopyableWrapper onMouseLeave={() => setCopied(false)}>
      <div className="component">{children}</div>
      <Popover contents={copied ? after : before}>
        <Link45deg
          onClick={() => {
            onClick()
            setCopied(true)
          }}
          className="link-icon"
        />
      </Popover>
    </CopyableWrapper>
  )
}
