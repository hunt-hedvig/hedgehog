import { useContractMarketInfo } from 'graphql/use-get-member-contract-market-info'
import React from 'react'
import { Market } from 'types/enums'
import { getMemberFlag } from 'utils/member'

export const MemberFlag: React.FC<{
  memberId: string
}> = ({ memberId }) => {
  const [contractMarket] = useContractMarketInfo(memberId)
  const market = contractMarket?.market as Market | undefined
  return <>{market && getMemberFlag(market)}</>
}
