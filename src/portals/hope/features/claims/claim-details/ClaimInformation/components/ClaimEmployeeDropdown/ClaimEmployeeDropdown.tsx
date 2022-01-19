import React from 'react'
import { Dropdown, DropdownOption } from '@hedvig-ui'
import {
  useClaimEmployeeCoverageQuery,
  useSetCoveringEmployeeMutation,
} from 'types/generated/graphql'
import gql from 'graphql-tag'

gql`
  query ClaimEmployeeCoverage($claimId: ID!) {
    claim(id: $claimId) {
      id
      coveringEmployee
    }
  }

  mutation SetCoveringEmployee($id: ID!, $coveringEmployee: Boolean!) {
    setCoveringEmployee(id: $id, coveringEmployee: $coveringEmployee) {
      id
      coveringEmployee
    }
  }
`

export const ClaimEmployeeDropdown: React.FC<{ claimId: string }> = ({
  claimId,
}) => {
  const [setCoveringEmployee] = useSetCoveringEmployeeMutation()
  const { data } = useClaimEmployeeCoverageQuery({ variables: { claimId } })

  const covering = !!data?.claim?.coveringEmployee

  const options = [
    {
      key: 0,
      value: 'True',
      text: 'True',
      selected: covering || false,
    },
    { key: 1, value: 'False', text: 'False', selected: !covering },
  ]

  const coverEmployeeHandler = (value: string) => {
    setCoveringEmployee({
      variables: {
        id: claimId,
        coveringEmployee: value === 'True',
      },
      optimisticResponse: {
        setCoveringEmployee: {
          id: claimId,
          __typename: 'Claim',
          coveringEmployee: value === 'True',
        },
      },
    })
  }

  return (
    <Dropdown>
      {options.map((option) => (
        <DropdownOption
          key={option.key}
          selected={option.selected}
          onClick={() => coverEmployeeHandler(option.value)}
        >
          {option.text}
        </DropdownOption>
      ))}
    </Dropdown>
  )
}
