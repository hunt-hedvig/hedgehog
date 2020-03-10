import { DocumentNode } from 'apollo-boost'
import {
  Contract,
  GetContractsDocument,
  GetContractsQueryHookResult,
  GetContractsQueryVariables,
  useGetContractsQuery,
} from '../api/generated/graphql'

export const useContracts = (
  memberId: string,
): [ReadonlyArray<Contract>, GetContractsQueryHookResult] => {
  const query = useGetContractsQuery({
    variables: { memberId },
  })
  const contracts = (query.data?.member?.contracts ?? []) as Contract[]
  return [contracts, query]
}

export const refetchContracts = (
  memberId: string,
): {
  query: DocumentNode
  variables: GetContractsQueryVariables
} => {
  return {
    query: GetContractsDocument,
    variables: {
      memberId,
    },
  }
}
