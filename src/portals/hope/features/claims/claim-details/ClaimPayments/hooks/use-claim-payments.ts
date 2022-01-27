import gql from 'graphql-tag'
import { ArrayElement } from '@hedvig-ui/utils/array-element'
import {
  ClaimPaymentsFragment,
  useSortableClaimPaymentsQuery,
} from 'types/generated/graphql'
import { useState } from 'react'

gql`
  query SortableClaimPayments($claimId: ID!) {
    claim(id: $claimId) {
      id
      ...ClaimPayments
    }
  }

  fragment ClaimPayments on Claim {
    payments {
      id
      deductible
      amount
      exGratia
      status
      note
      type
      paidAt
      timestamp
    }
  }
`

type ClaimPayment = ArrayElement<ClaimPaymentsFragment['payments']>

interface UseClaimPaymentsResult {
  payments: ClaimPayment[]
  totalAmount: number
  totalDeductible: number
  setSortBy: (sortBy: Partial<SortBy>) => void
  sortBy: SortBy
}

type SortableField = keyof ClaimPayment

interface SortBy {
  field: SortableField
  desc: boolean
}

export const useClaimPayments = (claimId: string): UseClaimPaymentsResult => {
  const { data } = useSortableClaimPaymentsQuery({ variables: { claimId } })

  const [sortBy, setSortBy] = useState<SortBy>({
    field: 'paidAt',
    desc: true,
  })

  const setSortByHandler = (newSortBy: Partial<SortBy>) => {
    setSortBy({
      field: newSortBy?.field ?? sortBy.field,
      desc: newSortBy?.desc ?? sortBy.desc,
    })
  }

  const sortHandler = (p1: ClaimPayment, p2: ClaimPayment) => {
    const direction = sortBy.desc ? 1 : -1

    switch (sortBy.field) {
      case 'amount':
      case 'deductible':
        return (
          (+p1[sortBy.field].amount < +p2[sortBy.field].amount ? 1 : -1) *
          direction
        )

      case 'paidAt':
        return (p1[sortBy.field] < p2[sortBy.field] ? 1 : -1) * direction

      default:
        return 0
    }
  }

  const payments = (data?.claim?.payments ?? []).slice().sort(sortHandler)

  const totalAmount = payments
    .map((payment) => +payment?.amount?.amount)
    .reduce((acc, amount) => acc + amount, 0)

  const totalDeductible = payments
    .map((payment) => +payment?.deductible?.amount)
    .reduce((acc, amount) => acc + amount, 0)

  return {
    payments,
    totalAmount,
    totalDeductible,
    setSortBy: setSortByHandler,
    sortBy,
  }
}
