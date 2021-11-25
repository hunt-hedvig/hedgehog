import styled from '@emotion/styled'
import { FadeIn, MainHeadline } from '@hedvig-ui'
import { ClaimsTemplates } from 'features/claims/claim-templates/ClaimsTemplatesList'
import { useTemplateClaims } from 'features/claims/claim-templates/hooks/use-template-claims'
import { ClaimListFilters } from 'features/claims/claims-list/filters/ClaimListFilters'
import { ClaimListTemplateFilters } from 'features/claims/claims-list/filters/ClaimListTemplateFilters'
import { LargeClaimsList } from 'features/claims/claims-list/LargeClaimsList'
import React, { useEffect, useMemo, useState } from 'react'
import { RouteComponentProps, useLocation } from 'react-router'
import { ClaimComplexity, ClaimState } from 'types/generated/graphql'

const ListPage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 0;
`

const useQuery = () => {
  const { search } = useLocation()

  return useMemo(() => new URLSearchParams(search), [search])
}

export interface ClaimsFiltersType {
  filterClaimStates: ClaimState[] | null
  filterCreatedBeforeOrOnDate: string | null
  filterComplexities: ClaimComplexity[] | null
  filterNumberOfMemberGroups: number | null
  filterSelectedMemberGroups: number[] | null
  filterMarkets: string[] | null
  filterTypesOfContract: string[] | null
}

const ClaimsListPage: React.FC<RouteComponentProps<{
  page?: string
}>> = ({
  match: {
    params: { page = '1' },
  },
}) => {
  const location = useLocation()
  const filterQuery = useQuery().get('filter')

  const {
    templateActive,
    selectedTemplate,
    localFilter,
    templateFilters,
    selectTemplate,
    createTemplate,
    editTemplate,
  } = useTemplateClaims(filterQuery)

  const [date, setDate] = useState<string | null>(null)

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

      <ClaimsTemplates
        activeId={selectedTemplate}
        templates={templateFilters}
        onSelect={selectTemplate}
        onCreate={createTemplate}
      />

      {templateActive && selectedTemplate ? (
        <ClaimListTemplateFilters
          templatedId={selectedTemplate}
          filters={localFilter}
          setFilters={editTemplate}
        />
      ) : (
        <ClaimListFilters date={date} setDate={setDate} page={page} />
      )}

      <LargeClaimsList
        page={selectedPage}
        date={date}
        templated={templateActive}
        filters={templateActive ? localFilter : undefined}
      />
    </ListPage>
  )
}

export default ClaimsListPage
