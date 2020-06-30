import { Chip } from '@material-ui/core'
import { ChipProps } from '@material-ui/core/Chip'
import React from 'react'
import styled from 'react-emotion'

const ChipIconBase = styled.span`
  color: ${({ theme }) => theme.accentContrast};
  font-size: 0.9rem;
  padding: 9px;
  padding-right: 8px;
  margin-right: -15px;
`

export const BaseChip: React.FC<{
  icon?: React.ReactElement | undefined
  adornment?: React.ReactElement | undefined
  ignored?: boolean
  props: ChipProps
  className?: string
}> = ({ icon, adornment, props, className }) => {
  const { onDelete, ...chipProps } = props
  return (
    <Chip
      avatar={icon ? <ChipIconBase>{icon}</ChipIconBase> : undefined}
      onDelete={onDelete ?? (adornment && (() => void 0))}
      deleteIcon={<>{adornment}</>}
      className={className}
      {...chipProps}
    />
  )
}
