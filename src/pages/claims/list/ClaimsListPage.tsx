import styled from '@emotion/styled'
import { FadeIn, MainHeadline } from '@hedvig-ui'
import {
  Keys,
  useKeyIsPressed,
} from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { ClaimsTemplates } from 'features/claims/claim-templates/ClaimsTemplatesList'
import { useTemplateClaims } from 'features/claims/claim-templates/hooks/use-template-claims'
import { ClaimListFilters } from 'features/claims/claims-list/filters/ClaimListFilters'
import { ClaimListTemplateFilters } from 'features/claims/claims-list/filters/ClaimListTemplateFilters'
import { LargeClaimsList } from 'features/claims/claims-list/LargeClaimsList'
import {
  FocusItems,
  useFocus,
  useNavigation,
} from 'features/navigation/hooks/use-navigation'
import React, { useEffect, useMemo, useState } from 'react'
import { RouteComponentProps, useLocation } from 'react-router'
import { ClaimComplexity, ClaimState } from 'types/generated/graphql'
import { Page } from 'pages/routes'

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

const ClaimsListPage: Page<
  RouteComponentProps<{
    page?: string
  }>
> = ({
  match: {
    params: { page = '1' },
  },
}) => {
  const location = useLocation()
  const filterQuery = useQuery().get('template')

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

  const { focus, setFocus } = useNavigation()

  useFocus(FocusItems.Claims.name)

  const isFPressed = useKeyIsPressed(Keys.F)
  const isTPressed = useKeyIsPressed(Keys.T)

  useEffect(() => {
    if (isFPressed) {
      setFocus(FocusItems.Claims.items.ClaimsFilters)
    }
  }, [isFPressed])

  useEffect(() => {
    if (isTPressed) {
      setFocus(FocusItems.Claims.items.ClaimsTemplates)
    }
  }, [isTPressed])

  return (
    <ListPage>
      <FadeIn>
        <MainHeadline>Claims</MainHeadline>
      </FadeIn>

      <ClaimsTemplates
        activeId={selectedTemplate}
        templates={templateFilters}
        onSelect={(id) => {
          setFocus(null)
          selectTemplate(id)
        }}
        onCreate={createTemplate}
        navigationAvailable={focus === FocusItems.Claims.items.ClaimsTemplates}
      />

      {templateActive && selectedTemplate ? (
        <ClaimListTemplateFilters
          templateId={selectedTemplate}
          template={localFilter}
          editTemplate={editTemplate}
          navigationAvailable={focus === FocusItems.Claims.items.ClaimsFilters}
        />
      ) : (
        <ClaimListFilters
          date={date}
          setDate={setDate}
          page={page}
          navigationAvailable={focus === FocusItems.Claims.items.ClaimsFilters}
        />
      )}

      <LargeClaimsList
        page={selectedPage}
        date={date}
        navigationAvailable={focus === FocusItems.Claims.name}
        templated={templateActive}
        filters={templateActive ? localFilter : undefined}
      />
    </ListPage>
  )
}

export default ClaimsListPage
