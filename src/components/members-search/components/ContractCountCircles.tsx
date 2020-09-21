import { Contract, ContractStatus } from 'api/generated/graphql'
import { Popover } from 'hedvig-ui/popover'
import React from 'react'
import styled from 'react-emotion'

type CircleVariation =
  | 'success'
  | 'warning'
  | 'danger'
  | 'accent'
  | 'placeholderColor'

const Circle = styled.div<{
  variation?: CircleVariation
}>`
  margin: 0 5px;
  height: 25px;
  width: 25px;
  background-color: ${({ theme, variation = 'accent' }) => theme[variation]};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`

type NumberOfContracts = {
  [key in ContractStatus]?: number
}

const countContractsByStatus = (contracts: Contract[]): NumberOfContracts =>
  contracts.reduce((acc, { status }) => {
    switch (status) {
      case ContractStatus.Pending:
      case ContractStatus.Terminated:
        acc[status] = (acc[status] || 0) + 1
        break
      default:
        acc[ContractStatus.Active] = (acc[ContractStatus.Active] || 0) + 1
    }

    return acc
  }, {})

const CountCircle: React.FC<{
  label: string
  variation?: CircleVariation
  count?: number
}> = ({ label, variation = 'accent', count }) => {
  if (count === undefined) {
    return <></>
  }

  return (
    <Popover contents={`${label}${count !== 1 ? 's' : ''}`}>
      <Circle variation={count ? variation : 'placeholderColor'}>
        {count}
      </Circle>
    </Popover>
  )
}

export const ContractCountCircles: React.FC<{
  contracts: Contract[]
}> = ({ contracts }) => {
  const {
    ACTIVE: ActiveContracts = 0,
    PENDING: PendingContracts = 0,
    TERMINATED: TerminatedContracts = 0,
  } = countContractsByStatus(contracts)

  return (
    <>
      <CountCircle
        label={'Pending contract'}
        variation={'warning'}
        count={PendingContracts}
      />
      <CountCircle
        label={'Active contract'}
        variation={'success'}
        count={ActiveContracts}
      />
      <CountCircle
        label={'Terminated contract'}
        variation={'danger'}
        count={TerminatedContracts}
      />
    </>
  )
}
