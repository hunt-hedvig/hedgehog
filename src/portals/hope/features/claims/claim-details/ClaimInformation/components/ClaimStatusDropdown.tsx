import React from 'react'
import {
  ClaimState,
  useClaimStatusQuery,
  useSetClaimStatusMutation,
} from 'types/generated/graphql'
import { Dropdown, DropdownOption } from '@hedvig-ui'
import gql from 'graphql-tag'
import { ClaimOutcomes } from 'portals/hope/features/claims/claim-details/ClaimInformation/components/ClaimOutcomeDropdown'
import { toast } from 'react-hot-toast'
import { convertEnumToTitle } from '@hedvig-ui/utils/text'
import { PushUserAction } from 'portals/hope/features/tracking/utils/tags'

gql`
  query ClaimStatus($claimId: ID!) {
    claim(id: $claimId) {
      id
      state
      outcome
      payments {
        id
      }
    }
  }

  mutation SetClaimStatus($claimId: ID!, $status: ClaimState!) {
    updateClaimState(id: $claimId, state: $status) {
      id
      state
    }
  }
`

interface UseClamStatusResult {
  status: string | null
  setStatus: (status: ClaimState) => void
}

const useClaimStatus = (claimId: string): UseClamStatusResult => {
  const [setClaimStatus] = useSetClaimStatusMutation()
  const { data } = useClaimStatusQuery({ variables: { claimId } })

  const status = data?.claim?.state
  const outcome = data?.claim?.outcome
  const payments = data?.claim?.payments ?? []

  const validate = (newStatus: ClaimState): boolean => {
    const isOpen = status === ClaimState.Open || status === ClaimState.Reopened

    const restrictedOutcome =
      outcome === ClaimOutcomes.DUPLICATE ||
      outcome === ClaimOutcomes.NOT_COVERED_BY_TERMS ||
      outcome === ClaimOutcomes.RETRACTED_BY_MEMBER ||
      outcome === ClaimOutcomes.RETRACTED_BY_HEDVIG

    if (isOpen && restrictedOutcome && payments.length !== 0) {
      toast.error("This outcome can't be used to close when there are payments")
      return false
    }

    if (status === ClaimState.Closed && newStatus === ClaimState.Open) {
      toast.error('The claim can only be reopened')
      return false
    }

    return true
  }

  const setStatus = (newStatus: ClaimState) => {
    if (!validate(newStatus)) {
      return
    }

    PushUserAction('claim', 'set', 'status', newStatus)

    setClaimStatus({
      variables: { claimId, status: newStatus },
      optimisticResponse: {
        updateClaimState: {
          id: claimId,
          __typename: 'Claim',
          state: newStatus,
        },
      },
    })
  }

  return {
    status: data?.claim?.state ?? null,
    setStatus,
  }
}

export const ClaimStatusDropdown: React.FC<{ claimId: string }> = ({
  claimId,
}) => {
  const { status, setStatus } = useClaimStatus(claimId)

  const options = Object.values(ClaimState)
  return (
    <Dropdown placeholder="State">
      {options.map((state) => (
        <DropdownOption
          key={state}
          onClick={() => setStatus(state)}
          selected={status === state}
        >
          {convertEnumToTitle(state)}
        </DropdownOption>
      ))}
    </Dropdown>
  )
}
