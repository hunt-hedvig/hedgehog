import { Member } from 'api/generated/graphql'
import { ListItem } from 'components/members-search/components/ListItem'
import { SearchForm } from 'components/members-search/components/SearchForm'
import BackendPaginatorList from 'components/shared/paginator-list/BackendPaginatorList'
import { useMemberSearch } from 'graphql/use-member-search'
import { MainHeadline } from 'hedvig-ui/typography'
import React, { useRef } from 'react'
import { findDOMNode } from 'react-dom'
import styled, { keyframes } from 'react-emotion'
import { useHistory } from 'react-router'
import { Table } from 'semantic-ui-react'
import { useVerticalKeyboardNavigation } from 'utils/keyboard-actions'
import { MemberSuggestions } from './components/MemberSuggestions'

const fadeIn = (max: number) =>
  keyframes({
    from: { opacity: 0, transform: 'translateY(5%)' },
    to: { opacity: max, transform: 'translateY(0)' },
  })

const Instructions = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  textAlign: 'left',
  paddingLeft: '1rem',
  paddingTop: '2rem',
  code: {
    background: theme.backgroundTransparent,
    padding: '1px 2px',
    borderRadius: 1,
  },
  opacity: 0,
  animation: `${fadeIn(0.3)} 1000ms forwards`,
  animationDelay: '500ms',
}))

const MemberSuggestionsWrapper = styled(Instructions)({
  paddingTop: '25vh',
  width: '100%',
  maxWidth: '50rem',
  animation: `${fadeIn(1)} 1000ms forwards`,
  animationDelay: '750ms',
})

const NoMembers = styled(Instructions)({
  width: '100%',
  flex: 1,
  alignItems: 'center',
  fontSize: '1.5rem',
  paddingTop: '25vh',
})

const ExtraInstruction = styled('div')({
  opacity: 0,
  animation: `${fadeIn(1)} 1000ms forwards`,
  animationDelay: '1000ms',
})

const ListWrapper = styled('div')({
  paddingLeft: '1rem',
})

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

export const MembersSearch: React.FC = () => {
  const [query, setQuery] = React.useState('')
  const [includeAll, setIncludeAll] = React.useState(false)
  const history = useHistory()
  const searchField = useRef<React.ReactElement>()

  const [
    { members, totalPages, page },
    memberSearch,
    { loading },
  ] = useMemberSearch()
  const [currentKeyboardNavigationStep] = useVerticalKeyboardNavigation({
    maxStep: members.length - 1,
    isActive: members.length > 0,
    onNavigationStep: () => {
      const input =
        searchField.current &&
        findInputFieldDomElementHackishly(searchField.current)
      if (input) {
        input.blur()
      }
    },
    onPerformNavigation: (index) => {
      history.push(`/members/${members[index].memberId}`)
    },
  })

  const noMembersFound = members.length === 0 && query && !loading

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
      />
      {members.length > 0 && (
        <ListWrapper>
          <BackendPaginatorList<Member>
            currentPage={page}
            totalPages={totalPages}
            changePage={(nextPage) =>
              memberSearch(query, { includeAll, page: nextPage, pageSize: 25 })
            }
            pagedItems={members}
            itemContent={(member, index) => (
              <ListItem
                member={member}
                active={currentKeyboardNavigationStep === index}
              />
            )}
            isSortable={false}
            tableHeader={<ListHeader />}
          />
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

const ListHeader: React.FC = () => (
  <Table.Header>
    <Table.HeaderCell>Member</Table.HeaderCell>
    <Table.HeaderCell />
    <Table.HeaderCell>Sign up</Table.HeaderCell>
    <Table.HeaderCell>Active from</Table.HeaderCell>
    <Table.HeaderCell>Active to</Table.HeaderCell>
    <Table.HeaderCell>Status</Table.HeaderCell>
    <Table.HeaderCell>Size</Table.HeaderCell>
  </Table.Header>
)
