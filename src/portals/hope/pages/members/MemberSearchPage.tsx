import { FadeIn, MainHeadline, TablePageSelect } from '@hedvig-ui'
import { useTitle } from '@hedvig-ui/hooks/use-title'
import { MembersList } from 'portals/hope/features/members-search/components/MembersList'
import { MemberSuggestions } from 'portals/hope/features/members-search/components/MemberSuggestions'
import { SearchForm } from 'portals/hope/features/members-search/components/SearchForm'
import {
  ExtraInstruction,
  Instructions,
  MemberSuggestionsWrapper,
  NoMembers,
} from 'portals/hope/features/members-search/styles'
import React, { useRef } from 'react'
import { useHistory } from 'react-router'
import { Page } from 'portals/hope/pages/routes'
import { useMemberHistory } from 'portals/hope/features/user/hooks/use-member-history'
import { useMemberSearch } from 'portals/hope/features/members-search/hooks/use-member-search'
import { ExtensiveMemberSearchQuery } from 'types/generated/graphql'
import { PushUserAction } from 'portals/hope/features/tracking/utils/tags'

const MemberSearchPage: Page = () => {
  const [query, setQuery] = React.useState('')
  const [includeAll, setIncludeAll] = React.useState(false)
  const [luckySearch, setLuckySearch] = React.useState(false)
  const history = useHistory()
  const searchField = useRef<HTMLInputElement>(null)

  const { memberHistory } = useMemberHistory()

  const { members, totalPages, page, search, loading } = useMemberSearch(false)

  const noMembersFound = members.length === 0 && query && !loading

  React.useEffect(() => {
    if ((members.length && luckySearch) || members.length === 1) {
      history.push(`/members/${members[0].memberId}/contracts`)
    }
  }, [members])

  const pageSelectHandler = (nextPage: number) => {
    search(query || '%', { page: nextPage - 1 ?? 0 })
  }

  useTitle('Members')

  return (
    <>
      <SearchForm
        membersLength={members.length}
        suggestionsLength={memberHistory.length}
        onSubmit={() => {
          PushUserAction('members', 'search', null, 'legacy')
          search(query || '%', {
            includeAll,
          })
        }}
        loading={loading}
        query={query}
        setQuery={setQuery}
        includeAll={includeAll}
        setIncludeAll={setIncludeAll}
        currentResultSize={members.length}
        ref={searchField}
        setLuckySearch={setLuckySearch}
      />
      {page !== undefined && totalPages !== undefined && (
        <>
          <FadeIn>
            <MembersList
              members={
                members as ExtensiveMemberSearchQuery['memberSearch']['members']
              }
            />
            <TablePageSelect
              rowCount={members.length}
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
            <MemberSuggestions suggestions={memberHistory} />
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
