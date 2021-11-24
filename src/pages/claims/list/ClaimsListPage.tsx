import styled from '@emotion/styled'
import { FadeIn, MainHeadline } from '@hedvig-ui'
import { useInsecurePersistentState } from '@hedvig-ui/hooks/use-insecure-persistent-state'
import { ClaimsTemplates } from 'features/claims/claims-list/ClaimsTemplates'
import { ClaimListFilters } from 'features/claims/claims-list/filters/ClaimListFilters'
import { ClaimListTemplateFilters } from 'features/claims/claims-list/filters/ClaimListTemplateFilters'
import { LargeClaimsList } from 'features/claims/claims-list/LargeClaimsList'
import {
  ClaimsFiltersTypeWithName,
  TemplateFiltersType,
} from 'pages/DashboardPage'
import React, { useEffect, useState } from 'react'
import { RouteComponentProps, useHistory, useLocation } from 'react-router'
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
  const history = useHistory()

  const [templated, setTemplated] = useState(false)
  const [selectedTemplateId, setSelectedTemplateId] = useState<
    number | undefined
  >()
  const [filters, setFilters] = useState<ClaimsFiltersType>({
    filterClaimStates: null,
    filterCreatedBeforeOrOnDate: null,
    filterComplexities: null,
    filterNumberOfMemberGroups: null,
    filterSelectedMemberGroups: null,
    filterMarkets: null,
    filterTypesOfContract: null,
  })
  const [templateFilters, setTemplateFilters] = useInsecurePersistentState<
    TemplateFiltersType
  >('claims:template-filters', {
    filters: [],
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
        setSelectedTemplateId(+filterQuery)
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

  const selectTemplatedHandler = (id: number) => {
    if (id === selectedTemplateId) {
      setSelectedTemplateId(undefined)
      history.push(`/claims/list/1`)
      return
    }

    history.push(`/claims/list/1?filter=${id}`)
  }

  const createTemplateHandler = (
    id: number,
    filter: ClaimsFiltersTypeWithName,
  ) => {
    setTemplateFilters((prev) => ({
      filters: [
        ...prev.filters,
        {
          ...filter,
          name: filter.name ? filter.name : `Claims Template ${id + 1}`,
        },
      ],
    }))
  }

  const editTemplateHandler = (newFilter: ClaimsFiltersType, id?: number) => {
    setFilters(newFilter)
    setTemplateFilters((prev) => ({
      filters: prev.filters.map((filter, index) =>
        index !== id ? filter : { ...newFilter, name: filter.name },
      ),
    }))
  }

  return (
    <ListPage>
      <FadeIn>
        <MainHeadline>Claims</MainHeadline>
      </FadeIn>

      <ClaimsTemplates
        activeId={selectedTemplateId}
        templates={templateFilters}
        selectHandler={selectTemplatedHandler}
        createHandler={createTemplateHandler}
      />

      {templated && filterQuery ? (
        <ClaimListTemplateFilters
          templatedId={+filterQuery}
          filters={filters}
          setFilters={editTemplateHandler}
        />
      ) : (
        <ClaimListFilters
          date={!templated ? date : undefined}
          setDate={!templated ? setDate : undefined}
          page={page}
        />
      )}

      <LargeClaimsList
        page={selectedPage}
        date={date}
        templated={templated}
        filters={templated ? filters : undefined}
      />
    </ListPage>
  )
}

export default ClaimsListPage
