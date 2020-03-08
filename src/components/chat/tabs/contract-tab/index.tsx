import { useContracts } from 'hooks/use-contracts'
import * as React from 'react'
import { Spacing } from '../../../../../shared/hedvig-ui/spacing'
import { MainHeadline } from '../../../../../shared/hedvig-ui/typography'
import { ContractItem } from './contract-item'

export const Contracts: React.FunctionComponent<{
  memberId: string
}> = ({ memberId }) => {
  const [contracts, contractsLoading] = useContracts(memberId)
  return (
    <Spacing all>
      <MainHeadline>Contracts</MainHeadline>
      {contractsLoading && 'Loading...'}
      {!contractsLoading && contracts.length === 0 && 'No contracts for member'}
      {contracts.map((contract) => (
        <ContractItem key={contract.id} contract={contract} />
      ))}
    </Spacing>
  )
}
