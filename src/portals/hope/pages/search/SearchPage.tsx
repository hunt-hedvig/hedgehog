import { Page } from 'portals/hope/pages/routes'
import React, { useMemo } from 'react'
import { MemberSearch } from 'portals/hope/features/search/members/MemberSearch'
import { RouteComponentProps, useHistory, useLocation } from 'react-router'
import { SearchCategory } from 'portals/hope/features/search/components/SearchCategoryButtons'
import { QuoteSearch } from 'portals/hope/features/search/quotes/QuoteSearch'
import { useCommandLine } from 'portals/hope/features/commands/use-command-line'
import { Keys } from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'

const useQueryParams = () => {
  const { search } = useLocation()

  return useMemo(() => new URLSearchParams(search), [search])
}

const SearchPage: Page<
  RouteComponentProps<{
    category?: SearchCategory
  }>
> = ({ match }) => {
  const history = useHistory()
  const category = match?.params?.category ?? 'members'
  const queryParams = useQueryParams()

  const { registerActions } = useCommandLine()

  registerActions([
    {
      label: `Search members`,
      keys: [Keys.Control, Keys.M],
      onResolve: () => {
        history.push(`/search/members?query=${queryParams.get('query')}`)
      },
    },
  ])

  registerActions([
    {
      label: `Search quotes`,
      keys: [Keys.Control, Keys.Q],
      onResolve: () => {
        history.push(`/search/quotes?query=${queryParams.get('query')}`)
      },
    },
  ])

  switch (category) {
    case 'quotes':
      return <QuoteSearch query={queryParams.get('query') ?? ''} />
    case 'members':
      return <MemberSearch query={queryParams.get('query') ?? ''} />
  }
}

export default SearchPage
