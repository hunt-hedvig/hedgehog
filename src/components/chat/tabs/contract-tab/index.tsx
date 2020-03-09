import { useContracts } from 'graphql/use-contracts'
import * as React from 'react'
import { Icon } from 'semantic-ui-react'
import { Button } from '../../../../../shared/hedvig-ui/button'
import { Spacing } from '../../../../../shared/hedvig-ui/spacing'
import { MainHeadline } from '../../../../../shared/hedvig-ui/typography'
import { ContractItem } from './contract-item'

export const Contracts: React.FunctionComponent<{
  memberId: string
}> = ({ memberId }) => {
  const [contracts, { data, loading, refetch }] = useContracts(memberId)
  console.log(data)
  return (
    <Spacing all>
      <MainHeadline>
        Contracts
        <Button onClick={() => refetch()} float={'right'}>
          Update
          <Icon name={'undo'} />
        </Button>
      </MainHeadline>
      {loading && 'Loading...'}
      {!loading && contracts.length === 0 && 'No contracts for member'}
      {contracts.map((contract) => (
        <ContractItem key={contract.id} contract={contract} />
      ))}
    </Spacing>
  )
}
