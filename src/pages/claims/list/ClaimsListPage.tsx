import styled from '@emotion/styled'
import { FadeIn, MainHeadline } from '@hedvig-ui'
import {
  Keys,
  useKeyIsPressed,
} from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { ClaimListFilters } from 'features/claims/claims-list/ClaimListFilters'
import { LargeClaimsList } from 'features/claims/claims-list/LargeClaimsList'
import {
  FocusItems,
  useNavigation,
} from 'features/navigation/hooks/use-navigation'
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

const ClaimsListPage: React.FC<RouteComponentProps<{
  page?: string
}>> = ({
  match: {
    params: { page = '1' },
  },
}) => {
  const location = useLocation()

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

  useEffect(() => {
    if (!focus) {
      setFocus(FocusItems.Claims.name)
    }
  }, [focus])

  const focusHandler = () => {
    setFocus(FocusItems.ClaimsFilters.name)
  }

  useKeyIsPressed(Keys.F, focusHandler)

  return (
    <ListPage>
      <FadeIn>
        <MainHeadline>Claims</MainHeadline>
      </FadeIn>

      <ClaimListFilters
        date={date}
        setDate={setDate}
        page={page}
        navigationAvailable={focus === FocusItems.ClaimsFilters.name}
      />

      <LargeClaimsList
        page={selectedPage}
        date={date}
        navigationAvailable={focus === FocusItems.Claims.name}
      />
    </ListPage>
  )
}

export default ClaimsListPage
