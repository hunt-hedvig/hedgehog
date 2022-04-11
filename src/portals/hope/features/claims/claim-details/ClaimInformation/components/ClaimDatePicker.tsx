import React from 'react'
import { TextDatePicker } from '@hedvig-ui'
import gql from 'graphql-tag'
import {
  useClaimDateOfOccurrenceQuery,
  useSetClaimDateOfOccurrenceMutation,
} from 'types/generated/graphql'
import { PushUserAction } from 'portals/hope/features/tracking/utils/tags'

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
  setDate: (date: string | null) => void
  date: string | null
}

const useClaimDatePicker = (claimId: string): UseClaimDatePickerResult => {
  const [setClaimDateOfOccurrence] = useSetClaimDateOfOccurrenceMutation()
  const { data } = useClaimDateOfOccurrenceQuery({ variables: { claimId } })

  const setDate = (date: string | null) => {
    PushUserAction('claim', 'set', 'date_of_occurrence', null)

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
    })
  }

  return { setDate, date: data?.claim?.dateOfOccurrence ?? null }
}

export const ClaimDatePicker: React.FC<{ claimId: string }> = ({
  claimId,
  ...props
}) => {
  const { setDate, date } = useClaimDatePicker(claimId)

  return (
    <TextDatePicker
      value={date}
      maxDate={new Date()}
      onChange={(newDate) => {
        setDate(newDate)
      }}
      placeholder="When did it happen?"
      {...props}
    />
  )
}
