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
import { useMemberHistory } from 'features/user/hooks/use-member-history'
import React, { useEffect, useRef } from 'react'
import { useHistory } from 'react-router'

const MemberSearchPage: React.FC = () => {
  const [query, setQuery] = React.useState('')
  const [includeAll, setIncludeAll] = React.useState(false)
  const [luckySearch, setLuckySearch] = React.useState(false)
  const history = useHistory()
  const searchField = useRef<HTMLInputElement>(null)

  const { memberHistory } = useMemberHistory()
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

  const isEnterPressed = useKeyIsPressed(Keys.Enter)
  const isDownPressed = useKeyIsPressed(Keys.Down)
  const { focus, setFocus } = useNavigation()

  useEffect(() => {
    setFocus(FocusItems.Members.items.Search)
  }, [])

  useEffect(() => {
    if (isEnterPressed && !focus) {
      setFocus(FocusItems.Members.items.Search)
    }
  }, [isEnterPressed])

  useEffect(() => {
    if (isDownPressed && !focus && !!memberHistory.length && !members.length) {
      setFocus(FocusItems.Members.items.Suggestions)
    }
  }, [isDownPressed])

  return (
    <div>
      <SearchForm
        onSubmit={() => {
          memberSearch(query || '%', {
            includeAll,
          })
          setFocus(null)
        }}
        loading={loading}
        query={query}
        setQuery={setQuery}
        includeAll={includeAll}
        setIncludeAll={setIncludeAll}
        currentResultSize={members.length}
        searchFieldRef={searchField as any}
        setLuckySearch={setLuckySearch}
        focus={focus === FocusItems.Members.items.Search}
      />
      {members.length > 0 && (
        <>
          <FadeIn>
            <MembersList
              setFocus={setFocus}
              members={members}
              navigationAvailable={focus === null}
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
              memberHistory={memberHistory}
              navigationAvailable={
                focus === FocusItems.Members.items.Suggestions
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
    </div>
  )
}

export default MemberSearchPage
