import styled from '@emotion/styled'
import { FadeIn } from '@hedvig-ui'
import { Filters } from 'components/claims/filter'
import { LargeClaimsList } from 'features/claims/claims-list/components/LargeClaimsList'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import { Header } from 'semantic-ui-react'
import { ClaimState } from 'types/generated/graphql'
import { useInsecurePersistentState } from 'utils/state'

const ListPage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 0;
`

export interface ClaimsFiltersType {
  filterClaimStates: ClaimState[] | []
  filterCreatedBeforeOrOnDate: string | null
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
      filterClaimStates: [],
      filterCreatedBeforeOrOnDate: null,
    },
  )

  const selectedPage = parseInt(page, 10)

  return (
    <ListPage>
      <FadeIn>
        <Header size="huge">Claims</Header>
      </FadeIn>

      <Filters filters={filters} setFilters={setFilters} />

      <LargeClaimsList page={selectedPage} filters={filters} />
    </ListPage>
  )
}
