import { Chip } from '@material-ui/core'
import React from 'react'
import styled from 'react-emotion'

export const ChipIconBase = styled.span`
  color: white;
  font-size: 0.9rem;
  padding: 9px;
  padding-right: 8px;
  margin-right: -15px;
`

export const BaseChip: React.FC<{
  label: string
  icon?: React.ReactElement | undefined
  adornment?: React.ReactElement | undefined
  clickable?: boolean
  className?: string
  onDelete?: React.EventHandler<any>
  onClick?: React.EventHandler<any>
  ignored?: boolean
}> = ({
  label,
  icon,
  adornment,
  clickable = false,
  className,
  onDelete,
  onClick,
}) => {
  return (
    <Chip
      avatar={icon ? <ChipIconBase>{icon}</ChipIconBase> : undefined}
      clickable={clickable}
      onDelete={onDelete ?? (adornment && (() => void 0))}
      onClick={onClick}
      deleteIcon={<>{adornment}</>}
      label={label}
      className={className}
    />
  )
}
