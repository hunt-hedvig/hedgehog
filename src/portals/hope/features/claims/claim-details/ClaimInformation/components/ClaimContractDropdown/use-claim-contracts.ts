import {
  PartialMemberContractFragment,
  PartialMemberTrialFragment,
  useCurrentClaimContractQuery,
  useMemberContractsQuery,
  useSetContractForClaimMutation,
  useSetTrialForClaimMutation,
} from 'types/generated/graphql'
import gql from 'graphql-tag'

gql`
  query MemberContracts($memberId: ID!) {
    member(id: $memberId) {
      memberId
      trials {
        ...PartialMemberTrial
      }
      contracts {
        ...PartialMemberContract
      }
    }
  }

  query CurrentClaimContract($claimId: ID!) {
    claim(id: $claimId) {
      contract {
        id
      }
      trial {
        id
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

export const useClaimContracts = (
  memberId: string,
  claimId: string,
): UseClaimContractsResult => {
  const [setContractForClaim] = useSetContractForClaimMutation()
  const [setTrialForClaim] = useSetTrialForClaimMutation()

  const { data: memberContractData } = useMemberContractsQuery({
    variables: { memberId },
  })

  const { data: claimContractData } = useCurrentClaimContractQuery({
    variables: { claimId },
  })

  const contracts = memberContractData?.member?.contracts ?? []
  const trials = memberContractData?.member?.trials ?? []

  const selected =
    claimContractData?.claim?.contract?.id ??
    claimContractData?.claim?.trial?.id ??
    null

  const handleSelectTrial = (trialId: string) => {
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
