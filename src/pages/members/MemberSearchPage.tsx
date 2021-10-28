import { FadeIn, MainHeadline, TablePageSelect } from '@hedvig-ui'
import {
  Keys,
  useKeyIsPressed,
} from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { MembersList } from 'features/members-search/components/MembersList'
import { MemberSuggestions } from 'features/members-search/components/MemberSuggestions'
import { SearchForm } from 'features/members-search/components/SearchForm'
import {
  ExtraInstruction,
  Instructions,
  ListWrapper,
  MemberSuggestionsWrapper,
  NoMembers,
} from 'features/members-search/styles'
import { useMemberSearch } from 'graphql/use-member-search'
import React, { useRef } from 'react'
import { findDOMNode } from 'react-dom'
import { useHistory } from 'react-router'
import { useVerticalKeyboardNavigation } from 'utils/keyboard-actions'

/**
 * Semantic UI haven't implemented refs corretly or they collide with react-emotion or something.
 * See https://github.com/Semantic-Org/Semantic-UI-React/issues/3819
 */
const findInputFieldDomElementHackishly = (
  instance: React.ReactElement,
): HTMLInputElement | null => {
  const wrapper = findDOMNode(instance as any) as HTMLInputElement | null

  if (!wrapper) {
    return null
  }

  return wrapper.querySelector('input') ?? null
}

const MemberSearchPage: React.FC = () => {
  const [query, setQuery] = React.useState('')
  const [includeAll, setIncludeAll] = React.useState(false)
  const [luckySearch, setLuckySearch] = React.useState(false)
  const history = useHistory()
  const searchField = useRef<React.ReactElement>()

  const isCommandPressed = useKeyIsPressed(Keys.Command)

  const [
    { members, totalPages, page },
    memberSearch,
    { loading },
  ] = useMemberSearch()

  const redirectMemberHandler = (id: string) => {
    const link = `/members/${id}`

    if (isCommandPressed) {
      window.open(link, '_blank')
      return
    }

    history.push(link)
  }

  const [
    currentKeyboardNavigationStep,
    resetKeyboardNavigationStep,
  ] = useVerticalKeyboardNavigation({
    maxStep: members.length - 1,
    onNavigationStep: () => {
      const input =
        searchField.current &&
        findInputFieldDomElementHackishly(searchField.current)
      if (input) {
        input.blur()
      }
    },
    onPerformNavigation: (index) => {
      redirectMemberHandler(members[index].memberId)
    },
    onExit: () => {
      const input =
        searchField.current &&
        findInputFieldDomElementHackishly(searchField.current)
      if (input) {
        input.focus()
      }
    },
  })

  const noMembersFound = members.length === 0 && query && !loading

  React.useEffect(() => {
    resetKeyboardNavigationStep()
  }, [query])

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
        onFocus={resetKeyboardNavigationStep}
      />
      {members.length > 0 && (
        <ListWrapper>
          <FadeIn>
            <MembersList
              navigationStep={currentKeyboardNavigationStep}
              members={members}
              redirectMemberHandler={redirectMemberHandler}
            />
            <TablePageSelect
              currentPage={page}
              totalPages={totalPages}
              onSelect={pageSelectHandler}
            />
          </FadeIn>
        </ListWrapper>
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
