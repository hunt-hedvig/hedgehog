import { Page } from 'portals/hope/pages/routes'
import React from 'react'
import { MemberSearch } from 'portals/hope/features/search/members/MemberSearch'
import { RouteComponentProps } from 'react-router'
import { SearchCategory } from 'portals/hope/features/search/components/SearchCategoryButtons'
import { QuoteSearch } from 'portals/hope/features/search/quotes/QuoteSearch'

const SearchPage: Page<
  RouteComponentProps<{
    category?: SearchCategory
  }>
> = ({ match }) => {
  const category = match?.params?.category ?? 'members'

  switch (category) {
    case 'quotes':
      return <QuoteSearch />
    case 'members':
      return <MemberSearch />
  }
}

export default SearchPage
