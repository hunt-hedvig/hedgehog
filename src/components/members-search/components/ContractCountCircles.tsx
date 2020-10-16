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
    const groupedStatus = [
      ContractStatus.Pending,
      ContractStatus.Terminated,
      ContractStatus.ActiveInFuture,
    ].includes(status)
      ? status
      : ContractStatus.Active
    return {
      ...acc,
      [groupedStatus]: (acc[groupedStatus] || 0) + 1,
    }
  }, {})

export const CountCircle: React.FC<{
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
    ACTIVE_IN_FUTURE: activeInFutureContracts = 0,
    ACTIVE: activeContracts = 0,
    PENDING: pendingContracts = 0,
    TERMINATED: terminatedContracts = 0,
  } = countContractsByStatus(contracts)

  return (
    <>
      <CountCircle
        label={'Pending contract'}
        variation={'warning'}
        count={pendingContracts}
      />
      <CountCircle
        label={'Active in future contract'}
        variation={'accent'}
        count={activeInFutureContracts}
      />
      <CountCircle
        label={'Active contract'}
        variation={'success'}
        count={activeContracts}
      />
      <CountCircle
        label={'Terminated contract'}
        variation={'danger'}
        count={terminatedContracts}
      />
    </>
  )
}
