import React from 'react'
import { XCircleFill } from 'react-bootstrap-icons'
import styled from 'react-emotion'
import { BaseChip } from './BaseChip'

const DiscardChip: React.FC = ({}) => {
  const Chip = styled(BaseChip)`
    background-color: #e24646;
    color: white;
    margin-top: 8px;
    font-weight: bold;
    margin-left: 7px;
  `
  return <Chip label={'Discard'} icon={<XCircleFill />} />
}

export default DiscardChip
