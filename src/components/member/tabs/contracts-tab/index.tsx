import { Contract } from 'components/member/tabs/contracts-tab/contract'
import { useContracts } from 'graphql/use-contracts'
import { Button } from 'hedvig-ui/button'
import { Spacing } from 'hedvig-ui/spacing'
import { MainHeadline } from 'hedvig-ui/typography'
import * as React from 'react'
import styled from 'react-emotion'
import { Icon } from 'semantic-ui-react'

const StyledButton = styled(Button)({
  float: 'right',
})

export const ContractTab: React.FunctionComponent<{
  memberId: string
}> = ({ memberId }) => {
  const [contracts, { loading, refetch }] = useContracts(memberId)
  return (
    <Spacing all>
      <MainHeadline>
        Contracts
        <StyledButton onClick={() => refetch()}>
          Update
          <Icon name={'undo'} />
        </StyledButton>
      </MainHeadline>
      {loading && 'Loading...'}
      {!loading && contracts.length === 0 && 'No contract for member'}
      {contracts.map((contract) => (
        <Contract
          key={contract.id}
          contract={contract}
          refetch={refetch}
          shouldPreSelectAgreement={
            contracts.length === 1 && !contract.isTerminated
          }
        />
      ))}
    </Spacing>
  )
}
