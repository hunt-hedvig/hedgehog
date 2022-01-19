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
  date: string | null
}

const useClaimDatePicker = (claimId: string): UseClaimDatePickerResult => {
  const [setClaimDateOfOccurrence] = useSetClaimDateOfOccurrenceMutation()
  const { data } = useClaimDateOfOccurrenceQuery({ variables: { claimId } })

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

  return { setDate, date: data?.claim?.dateOfOccurrence ?? null }
}

export const ClaimDatePicker: React.FC<{ claimId: string }> = ({ claimId }) => {
  const { setDate, date } = useClaimDatePicker(claimId)

  return (
    <TextDatePicker
      value={date}
      maxDate={new Date()}
      onChange={(newDate) => {
        if (!newDate || !date) {
          return
        }

        setDate(date)
      }}
      placeholder="When did it happen?"
    />
  )
}
