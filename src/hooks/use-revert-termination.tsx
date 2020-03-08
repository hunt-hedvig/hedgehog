import { ExecutionResult } from '@apollo/react-common'
import { useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { Contract } from '../api/generated/graphql'
import { noopFunction } from '../utils'
import { CONTRACTS_QUERY } from './use-contracts'

const REVERT_TERMINATION = gql`
  mutation RevertTermination($contractId: ID!) {
    revertTermination(contractId: $contractId) {
      id
    }
  }
`

export interface RevertTerminationOptions {
  variables: {
    contractId: string
  }
}

export const useRevertTermination = (
  contract: Contract,
  onCompleted: (value?: any) => void = noopFunction,
): [
  (ChangeTerminationDateInput) => Promise<ExecutionResult<Contract>>,
  boolean,
] => {
  const [revertTermination, { loading }] = useMutation(REVERT_TERMINATION, {
    onCompleted,
    refetchQueries: () => [
      {
        query: CONTRACTS_QUERY,
        variables: { memberId: contract.holderMemberId },
      },
    ],
  })
  return [revertTermination, loading]
}

export const revertTerminationOptions = (
  contract: Contract,
): RevertTerminationOptions => {
  return {
    variables: {
      contractId: contract.id,
    },
  }
}
