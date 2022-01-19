import React from 'react'
import { toast } from 'react-hot-toast'
import { TextDatePicker } from '@hedvig-ui'
import gql from 'graphql-tag'
import {
  useClaimDateOfOccurrenceQuery,
  useSetClaimDateOfOccurrenceMutation,
} from 'types/generated/graphql'

gql`
  query ClaimDateOfOccurrence($claimId: ID!) {
    claim(id: $claimId) {
      id
      dateOfOccurrence
    }
  }

  mutation SetClaimDateOfOccurrence($claimId: ID!, $date: LocalDate!) {
    setDateOfOccurrence(id: $claimId, date: $date) {
      id
      dateOfOccurrence
    }
  }
`

interface UseClaimDatePickerResult {
  setDate: (date: string) => void
}

const useClaimDatePicker = (claimId: string): UseClaimDatePickerResult => {
  const [setClaimDateOfOccurrence] = useSetClaimDateOfOccurrenceMutation()

  const setDate = (date: string) => {
    toast.promise(
      setClaimDateOfOccurrence({
        variables: {
          claimId,
          date,
        },
        optimisticResponse: {
          setDateOfOccurrence: {
            __typename: 'Claim',
            id: claimId,
            dateOfOccurrence: date,
          },
        },
      }),
      {
        loading: 'Setting date of occurrence',
        success: 'Date of occurrence set',
        error: 'Could not set date of occurrence',
      },
    )
  }

  return { setDate }
}

export const ClaimDatePicker: React.FC<{ claimId: string }> = ({ claimId }) => {
  const { setDate } = useClaimDatePicker(claimId)
  const { data } = useClaimDateOfOccurrenceQuery({ variables: { claimId } })

  return (
    <TextDatePicker
      value={data?.claim?.dateOfOccurrence ?? null}
      maxDate={new Date()}
      onChange={(date) => {
        if (!data?.claim || !date || data?.claim?.dateOfOccurrence === date) {
          return
        }
        setDate(date)
      }}
      placeholder="When did it happen?"
    />
  )
}
