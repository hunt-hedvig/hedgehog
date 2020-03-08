import { ExecutionResult } from '@apollo/react-common'
import { useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { Moment } from 'moment'
import {
  Contract,
  TerminateContractInput,
  TerminationReason,
} from '../api/generated/graphql'
import { noopFunction } from '../utils'
import { CONTRACTS_QUERY } from './use-contracts'

const TERMINATE_CONTRACT = gql`
  mutation TerminateContract($request: TerminateContractInput) {
    terminateContract(request: $request) {
      id
    }
  }
`

export const useTerminateContract = (
  contract: Contract,
  onCompleted: (value?: any) => void = noopFunction,
): [
  (ChangeTerminationDateInput) => Promise<ExecutionResult<Contract>>,
  boolean,
] => {
  const [terminateContract, { loading }] = useMutation(TERMINATE_CONTRACT, {
    onCompleted,
    refetchQueries: () => [
      {
        query: CONTRACTS_QUERY,
        variables: { memberId: contract.holderMemberId },
      },
    ],
  })
  return [terminateContract, loading]
}

export interface TerminateContractOptions {
  variables: {
    request: TerminateContractInput
  }
}

export const terminateContractOptions = (
  contract: Contract,
  terminationDate: Moment,
  terminationReason: TerminationReason,
  comment?: string,
): TerminateContractOptions => {
  return {
    variables: {
      request: {
        contractId: contract.id,
        terminationDate: terminationDate.format('YYYY-MM-DD'),
        terminationReason,
        comment,
      },
    },
  }
}
