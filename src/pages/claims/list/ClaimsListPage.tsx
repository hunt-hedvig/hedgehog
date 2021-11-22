import styled from '@emotion/styled'
import { FadeIn, MainHeadline } from '@hedvig-ui'
import { ClaimListFilters } from 'features/claims/claims-list/ClaimListFilters'
import { LargeClaimsList } from 'features/claims/claims-list/LargeClaimsList'
import React, { useEffect, useState } from 'react'
import { RouteComponentProps, useLocation } from 'react-router'
import { ClaimComplexity, ClaimState } from 'types/generated/graphql'

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

const useQuery = () => {
  const { search } = useLocation()

  return React.useMemo(() => new URLSearchParams(search), [search])
}

const ClaimsListPage: React.FC<RouteComponentProps<{
  page?: string
}>> = ({
  match: {
    params: { page = '1' },
  },
}) => {
  const filterQuery = useQuery().get('filter')
  const location = useLocation()

  const [templated, setTemplated] = useState(false)
  const [filters, setFilters] = useState({
    filterClaimStates: null,
    filterCreatedBeforeOrOnDate: null,
    filterComplexities: null,
    filterNumberOfMemberGroups: null,
    filterSelectedMemberGroups: null,
    filterMarkets: null,
    filterTypesOfContract: null,
  })

  const [date, setDate] = useState<string | null>(null)

  useEffect(() => {
    if (filterQuery) {
      const templateFilter = JSON.parse(
        localStorage.getItem('hvg:claims:template-filters') || '',
      )
      const filter = templateFilter.filters[filterQuery]

      if (filter) {
        delete filter.name
        setFilters(filter)
        setTemplated(true)
      }
    } else {
      setTemplated(false)
    }
  }, [filterQuery])

  useEffect(() => {
    const from = (location?.state as { from?: string })?.from

    if (from === 'menu') {
      setDate(new Date().toISOString().split('T')[0])
    }

    window.history.replaceState({}, document.title)
  }, [])

  const selectedPage = parseInt(page, 10)

  return (
    <ListPage>
      <FadeIn>
        <MainHeadline>Claims</MainHeadline>
      </FadeIn>

      <ClaimListFilters
        templated={templated}
        date={!templated ? date : undefined}
        setDate={!templated ? setDate : undefined}
        page={page}
        filters={templated ? filters : undefined}
        setFilters={templated ? setFilters : undefined}
      />

      <LargeClaimsList page={selectedPage} date={date} />
    </ListPage>
  )
}

export default ClaimsListPage
