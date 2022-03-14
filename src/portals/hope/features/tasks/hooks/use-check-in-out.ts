import gql from 'graphql-tag'
import {
  useCheckInInformationQuery,
  useCheckInMutation,
  useCheckOutMutation,
} from 'types/generated/graphql'

gql`
  mutation CheckIn {
    userCheckIn {
      id
      checkedIn
    }
  }

  mutation CheckOut {
    userCheckOut {
      id
      checkedIn
    }
  }

  query CheckInInformation {
    me {
      user {
        id
        checkedIn
      }
    }
  }
`

interface UseCheckInOutResult {
  checkedIn: boolean
  checkIn: () => void
  checkOut: () => void
  loading: boolean
}

export const useCheckInOut = (): UseCheckInOutResult => {
  const { data, loading } = useCheckInInformationQuery()
  const [checkIn] = useCheckInMutation()
  const [checkOut] = useCheckOutMutation()

  const user = data?.me?.user

  const checkInHandler = () => {
    if (!user) return

    checkIn({
      optimisticResponse: { userCheckIn: { id: user.id, checkedIn: true } },
    })
  }

  const checkOutHandler = () => {
    if (!user) return

    checkOut({
      optimisticResponse: { userCheckOut: { id: user.id, checkedIn: false } },
    })
  }

  return {
    checkIn: checkInHandler,
    checkOut: checkOutHandler,
    checkedIn: user?.checkedIn ?? false,
    loading,
  }
}
