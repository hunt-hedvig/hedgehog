import { useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { Moment } from 'moment'
import { Contract } from '../api/generated/graphql'
import { CONTRACTS_QUERY } from './use-contracts'

const ACTIVATE_PENDING_AGREMENT = gql`
  mutation ActivatePendingAgreement($request: ActivatePendingAgreementInput) {
    activatePendingAgreement(request: $request) {
      id
    }
  }
`

export const useActivateContract = () => {
  const [activateContract] = useMutation(ACTIVATE_PENDING_AGREMENT)
  return activateContract
}

export const activateContractOptions = (
  contract: Contract,
  activeFrom: Moment,
) => {
  return {
    variables: {
      request: {
        contractId: contract.id,
        agreementId: contract.currentAgreementId,
        fromDate: activeFrom.format('YYYY-MM-DD'),
      },
    },
    refetchQueries: () => [
      {
        query: CONTRACTS_QUERY,
        variables: { memberId: contract.holderMemberId },
      },
    ],
  }
}
