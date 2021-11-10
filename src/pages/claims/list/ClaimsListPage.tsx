import styled from '@emotion/styled'
import { FadeIn, MainHeadline } from '@hedvig-ui'
import { ClaimListFilters } from 'features/claims/claims-list/ClaimListFilters'
import { LargeClaimsList } from 'features/claims/claims-list/LargeClaimsList'
import { useMe } from 'features/user/hooks/use-me'
import React, { useEffect, useState } from 'react'
import { RouteComponentProps, useLocation } from 'react-router'
import {
  ClaimComplexity,
  ClaimState,
  UserSettingKey,
} from 'types/generated/graphql'

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
  const { settings, updateSetting } = useMe()

  const [filters, setFilters] = useState<ClaimsFiltersType>({
    filterClaimStates: settings[UserSettingKey.ClaimStatesFilter].claims,
    filterComplexities: settings[UserSettingKey.ClaimComplexityFilter].claims,
    filterNumberOfMemberGroups:
      settings[UserSettingKey.NumberOfMemberGroups].value,
    filterSelectedMemberGroups:
      settings[UserSettingKey.MemberGroupsFilter].claims,
    filterMarkets: settings[UserSettingKey.MarketFilter].claims,
    filterCreatedBeforeOrOnDate: null,
    filterTypesOfContract: null,
  })

  const setEmptyFilter = (field) => {
    if (!settings[field].claims) {
      updateSetting(field, {
        ...settings[field],
        claims: [],
      })
    }
  }

  useEffect(() => {
    setEmptyFilter(UserSettingKey.ClaimStatesFilter)
    setEmptyFilter(UserSettingKey.MemberGroupsFilter)
    setEmptyFilter(UserSettingKey.ClaimComplexityFilter)
    setEmptyFilter(UserSettingKey.MarketFilter)

    const from = (location?.state as { from?: string })?.from

    if (from === 'menu') {
      setFilters((currentFilters) => ({
        ...currentFilters,
        filterCreatedBeforeOrOnDate: new Date().toISOString().split('T')[0],
      }))
    }

    window.history.replaceState({}, document.title)
  }, [])

  const selectedPage = parseInt(page, 10)

  return (
    <ListPage>
      <FadeIn>
        <MainHeadline>Claims</MainHeadline>
      </FadeIn>

      <ClaimListFilters filters={filters} setFilters={setFilters} />

      <LargeClaimsList page={selectedPage} filters={filters} />
    </ListPage>
  )
}

export default ClaimsListPage
