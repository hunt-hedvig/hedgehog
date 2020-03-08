import { ExecutionResult } from '@apollo/react-common'
import { useMutation } from '@apollo/react-hooks'
import { ChangeTerminationDateInput, Contract } from 'api/generated/graphql'
import { gql } from 'apollo-boost'
import { Moment } from 'moment'
import { noopFunction } from '../utils'
import { CONTRACTS_QUERY } from './use-contracts'

const CHANGE_TERMINATION_DATE = gql`
  mutation ChangeTerminationDate($request: ChangeTerminationDateInput) {
    changeTerminationDate(request: $request) {
      id
    }
  }
`

export const useChangeTerminationDate = (
  contract: Contract,
  onCompleted: (value?: any) => void = noopFunction,
): [
  (ChangeTerminationDateInput) => Promise<ExecutionResult<Contract>>,
  boolean,
] => {
  const [changeTerminationDate, { loading }] = useMutation(
    CHANGE_TERMINATION_DATE,
    {
      onCompleted: () => onCompleted(),
      refetchQueries: () => [
        {
          query: CONTRACTS_QUERY,
          variables: { memberId: contract.holderMemberId },
        },
      ],
    },
  )
  return [changeTerminationDate, loading]
}

export interface ChangeTerminationDateOptions {
  variables: {
    request: ChangeTerminationDateInput
  }
}

export const changeTerminationDateOptions = (
  contract: Contract,
  newTerminationDate: Moment,
): ChangeTerminationDateOptions => {
  return {
    variables: {
      request: {
        contractId: contract.id,
        newTerminationDate: newTerminationDate.format('YYYY-MM-DD'),
      },
    },
  }
}
