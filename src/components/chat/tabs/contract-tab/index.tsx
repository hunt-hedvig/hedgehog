import { useContracts } from 'hooks/use-contracts'
import * as React from 'react'
import { Icon } from 'semantic-ui-react'
import { Button } from '../../../../../shared/hedvig-ui/button'
import { Spacing } from '../../../../../shared/hedvig-ui/spacing'
import { MainHeadline } from '../../../../../shared/hedvig-ui/typography'
import { ContractItem } from './contract-item'

export const Contracts: React.FunctionComponent<{
  memberId: string
}> = ({ memberId }) => {
  const [contracts, contractsLoading, refetchContracts] = useContracts(memberId)
  return (
    <Spacing all>
      <MainHeadline>
        Contracts
        <Button onClick={() => refetchContracts()} float={'right'}>
          Update
          <Icon name={'undo'} />
        </Button>
      </MainHeadline>
      {contractsLoading && 'Loading...'}
      {!contractsLoading && contracts.length === 0 && 'No contracts for member'}
      {contracts.map((contract) => (
        <ContractItem key={contract.id} contract={contract} />
      ))}
    </Spacing>
  )
}
