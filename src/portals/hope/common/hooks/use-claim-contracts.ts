import {
  PartialMemberContractFragment,
  PartialMemberTrialFragment,
  useCurrentClaimContractQuery,
  useSetContractForClaimMutation,
  useSetTrialForClaimMutation,
} from 'types/generated/graphql'
import gql from 'graphql-tag'
import { PushUserAction } from 'portals/hope/features/tracking/utils/tags'

gql`
  query CurrentClaimContract($claimId: ID!) {
    claim(id: $claimId) {
      contract {
        id
      }
      trial {
        id
      }
      member {
        memberId
        trials {
          ...PartialMemberTrial
        }
        contracts {
          ...PartialMemberContract
        }
      }
    }
  }

  fragment PartialMemberTrial on Trial {
    id
    fromDate
    toDate
    displayName
    address {
      street
    }
    partner
  }

  fragment PartialMemberContract on Contract {
    id
    masterInception
    terminationDate
    currentAgreement {
      id
      address {
        street
      }
      lineOfBusinessName
      typeOfContract
      carrier
      numberCoInsured
    }
  }

  mutation SetContractForClaim($claimId: ID!, $contractId: ID!) {
    setContractForClaim(claimId: $claimId, contractId: $contractId) {
      id
      contract {
        id
      }
    }
  }

  mutation SetTrialForClaim($claimId: ID!, $trialId: ID!) {
    setTrialForClaim(claimId: $claimId, trialId: $trialId) {
      id
      trial {
        id
      }
    }
  }
`

interface UseClaimContractsResult {
  contracts: PartialMemberContractFragment[]
  trials: PartialMemberTrialFragment[]
  selected: string | null
  setSelected: (selected: string) => void
}

/**
 * __useClaimContracts__
 *
 * - Get and set currently __selected__ contract or trial for a claim.
 * - Also provides a list of __contracts__ and __trials__ from the corresponding member.
 *
 * @param claimId
 *
 * @example
 *
 * const { contracts, trials, selected, setSelected } = useClaimContracts(claimId)
 */

export const useClaimContracts = (claimId: string): UseClaimContractsResult => {
  const [setContractForClaim] = useSetContractForClaimMutation()
  const [setTrialForClaim] = useSetTrialForClaimMutation()

  const { data } = useCurrentClaimContractQuery({
    variables: { claimId },
  })

  const contracts = data?.claim?.member?.contracts ?? []
  const trials = data?.claim?.member?.trials ?? []

  const selected = data?.claim?.contract?.id ?? data?.claim?.trial?.id ?? null

  const handleSelectTrial = (trialId: string) => {
    PushUserAction('claim', 'set', 'trial', null)
    setTrialForClaim({
      variables: {
        claimId,
        trialId,
      },
      optimisticResponse: {
        setTrialForClaim: {
          __typename: 'Claim',
          id: claimId,
          trial: {
            __typename: 'Trial',
            id: trialId,
          },
        },
      },
    })
  }

  const handleSelectContract = (contractId: string) => {
    PushUserAction('claim', 'set', 'contract', null)
    setContractForClaim({
      variables: {
        claimId,
        contractId,
      },
      optimisticResponse: {
        setContractForClaim: {
          __typename: 'Claim',
          id: claimId,
          contract: {
            __typename: 'Contract',
            id: contractId,
          },
        },
      },
    })
  }

  const setSelected = (id: string) => {
    if (id === selected) {
      return
    }

    if (trials.some((trial) => trial.id === id)) {
      handleSelectTrial(id)
      return
    }

    if (contracts.some((contract) => contract.id === id)) {
      handleSelectContract(id)
    }
  }

  return { contracts, trials, selected, setSelected }
}
