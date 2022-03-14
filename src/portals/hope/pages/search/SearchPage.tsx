import { Page } from 'portals/hope/pages/routes'
import React, { useMemo } from 'react'
import { MemberSearch } from 'portals/hope/features/search/members/MemberSearch'
import { RouteComponentProps, useLocation } from 'react-router'
import { SearchCategory } from 'portals/hope/features/search/components/SearchCategoryButtons'
import { QuoteSearch } from 'portals/hope/features/search/quotes/QuoteSearch'

const useQueryParams = () => {
  const { search } = useLocation()

  return useMemo(() => new URLSearchParams(search), [search])
}

const SearchPage: Page<
  RouteComponentProps<{
    category?: SearchCategory
  }>
> = ({ match }) => {
  const category = match?.params?.category ?? 'members'
  const queryParams = useQueryParams()

  switch (category) {
    case 'quotes':
      return <QuoteSearch query={queryParams.get('query')} />
    case 'members':
      return <MemberSearch query={queryParams.get('query')} />
  }
}

export default SearchPage
