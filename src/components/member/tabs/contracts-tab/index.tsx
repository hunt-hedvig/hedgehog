import { Contract } from 'components/member/tabs/contracts-tab/contract'
import { Headline } from 'components/member/tabs/shared/headline'
import { RefreshButton } from 'components/member/tabs/shared/refresh-button'
import { useContracts } from 'graphql/use-contracts'
import React from 'react'
import { ArrowRepeat } from 'react-bootstrap-icons'

export const ContractTab: React.FunctionComponent<{
  memberId: string
}> = ({ memberId }) => {
  const [contracts, { loading, refetch }] = useContracts(memberId)
  return (
    <>
      <Headline>
        Contracts
        <RefreshButton onClick={() => refetch()} loading={loading}>
          <ArrowRepeat />
        </RefreshButton>
      </Headline>
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
    </>
  )
}
