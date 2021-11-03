import { FadeIn, MainHeadline, TablePageSelect } from '@hedvig-ui'
import { MembersList } from 'features/members-search/components/MembersList'
import { MemberSuggestions } from 'features/members-search/components/MemberSuggestions'
import { SearchForm } from 'features/members-search/components/SearchForm'
import { useMemberSearch } from 'features/members-search/hooks/use-member-search'
import {
  ExtraInstruction,
  Instructions,
  MemberSuggestionsWrapper,
  NoMembers,
} from 'features/members-search/styles'
import React, { useRef } from 'react'
import { useHistory } from 'react-router'

const MemberSearchPage: React.FC = () => {
  const [query, setQuery] = React.useState('')
  const [includeAll, setIncludeAll] = React.useState(false)
  const [luckySearch, setLuckySearch] = React.useState(false)
  const history = useHistory()
  const searchField = useRef<React.ReactElement>()

  const [
    { members, totalPages, page },
    memberSearch,
    { loading },
  ] = useMemberSearch()

  const noMembersFound = members.length === 0 && query && !loading

  React.useEffect(() => {
    if ((members.length && luckySearch) || members.length === 1) {
      history.push(`/members/${members[0].memberId}`)
    }
  }, [members])

  const pageSelectHandler = (nextPage: number) => {
    memberSearch(query || '%', { page: nextPage - 1 ?? 0 })
  }

  return (
    <>
      <SearchForm
        onSubmit={() => {
          memberSearch(query || '%', {
            includeAll,
          })
        }}
        loading={loading}
        query={query}
        setQuery={setQuery}
        includeAll={includeAll}
        setIncludeAll={setIncludeAll}
        currentResultSize={members.length}
        searchFieldRef={searchField as any}
        setLuckySearch={setLuckySearch}
      />
      {members.length > 0 && (
        <>
          <FadeIn>
            <MembersList members={members} />
            <TablePageSelect
              currentPage={page}
              totalPages={totalPages}
              onSelect={pageSelectHandler}
            />
          </FadeIn>
        </>
      )}
      {members.length === 0 && !query && (
        <>
          <Instructions>
            <h1>Search for members</h1>
            <div>
              Search by <em>member id</em>, <em>personnummer</em>,{' '}
              <em>email</em>, <em>phone</em> or <em>name</em>
            </div>
            <div>
              <br />
              <code>%</code> is a wildcard character, it can be used to search
              for anything
            </div>
            <div>
              Example: <code>He%g</code> will match both <code>Hedvig</code> and{' '}
              <code>Hedgehog</code>
            </div>
            {query && (
              <ExtraInstruction>Press enter to search</ExtraInstruction>
            )}
          </Instructions>

          <MemberSuggestionsWrapper>
            <MainHeadline>Suggestions</MainHeadline>
            <MemberSuggestions />
          </MemberSuggestionsWrapper>
        </>
      )}

      {noMembersFound && (
        <NoMembers>
          <div>D*shborad! No members found</div>
        </NoMembers>
      )}
    </>
  )
}

export default MemberSearchPage
