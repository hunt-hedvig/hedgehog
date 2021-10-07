import styled from '@emotion/styled'
import { FadeIn, MainHeadline } from '@hedvig-ui'
import { Filters } from 'components/claims/filter'
import { LargeClaimsList } from 'features/claims/claims-list/components/LargeClaimsList'
import React, { useEffect } from 'react'
import { RouteComponentProps } from 'react-router'
import { ClaimComplexity, ClaimState } from 'types/generated/graphql'
import { useInsecurePersistentState } from 'utils/state'

const ListPage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 0;
`

export interface ClaimsFiltersType {
  filterClaimStates: ClaimState[] | null
  filterCreatedBeforeOrOnDate: string | null
  filterComplexities: ClaimComplexity[] | null
  filterNumberOfMemberGroups: number | null
  filterSelectedMemberGroups: number[] | null
  filterMarkets: string[] | null
  filterTypesOfContract: string[] | null
}

export const ClaimsListPage: React.FC<RouteComponentProps<{
  page?: string
}>> = ({
  match: {
    params: { page = '1' },
  },
}) => {
  const [filters, setFilters] = useInsecurePersistentState<ClaimsFiltersType>(
    'claims:filters',
    {
      filterClaimStates: null,
      filterCreatedBeforeOrOnDate: null,
      filterComplexities: null,
      filterNumberOfMemberGroups: null,
      filterSelectedMemberGroups: null,
      filterMarkets: null,
      filterTypesOfContract: null,
    },
  )

  const selectedPage = parseInt(page, 10)

  return (
    <ListPage>
      <FadeIn>
        <MainHeadline>Claims</MainHeadline>
      </FadeIn>

      <Filters filters={filters} setFilters={setFilters} />

      <LargeClaimsList page={selectedPage} filters={filters} />
    </ListPage>
  )
}
