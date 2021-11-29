import { FadeIn, MainHeadline, TablePageSelect } from '@hedvig-ui'
import {
  Keys,
  useKeyIsPressed,
} from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { useTitle } from '@hedvig-ui/hooks/use-title'
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
import {
  FocusItems,
  useNavigation,
} from 'features/navigation/hooks/use-navigation'
import React, { useEffect, useRef } from 'react'
import { useHistory } from 'react-router'

const MemberSearchPage: React.FC = () => {
  const [query, setQuery] = React.useState('')
  const [includeAll, setIncludeAll] = React.useState(false)
  const [luckySearch, setLuckySearch] = React.useState(false)
  const history = useHistory()
  const searchField = useRef<HTMLInputElement>(null)

  const [
    { members, totalPages, page },
    memberSearch,
    { loading },
  ] = useMemberSearch()

  const noMembersFound = members.length === 0 && query && !loading

  React.useEffect(() => {
    if ((members.length && luckySearch) || members.length === 1) {
      history.push(`/members/${members[0].memberId}/contracts`)
    }
  }, [members])

  const pageSelectHandler = (nextPage: number) => {
    memberSearch(query || '%', { page: nextPage - 1 ?? 0 })
  }

  useTitle('Members')

  const { focus, setFocus } = useNavigation()

  useEffect(() => {
    if (!focus) {
      setFocus(FocusItems.Members.name)
    }
  }, [focus])

  useKeyIsPressed(Keys.Down, () => {
    if (!members.length) {
      setFocus(FocusItems.Members.items?.Suggestions)
    }
  })

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
        focus={focus === FocusItems.Members.name}
      />
      {members.length > 0 && (
        <>
          <FadeIn>
            <MembersList
              members={members}
              navigationAvailable={focus === FocusItems.Members.name}
            />
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
            <MemberSuggestions
              navigationAvailable={
                focus === FocusItems.Members.items?.Suggestions
              }
            />
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
