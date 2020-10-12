import BackendPaginatorList from 'components/shared/paginator-list/BackendPaginatorList'
import { useHistory } from 'react-router'
import { format, parseISO } from 'date-fns'
import { Button } from 'hedvig-ui/button'
import { Checkbox } from 'hedvig-ui/checkbox'
import { Input } from 'hedvig-ui/input'
import { MainHeadline } from 'hedvig-ui/typography'
import React, { useEffect, useRef } from 'react'
import { Search as SearchBootstrapIcon } from 'react-bootstrap-icons'
import { findDOMNode } from 'react-dom'
import styled, { keyframes } from 'react-emotion'
import { Link } from 'react-router-dom'
import { Table } from 'semantic-ui-react'
import {
  MemberSearchFilter,
  MemberSearchResultItem,
  MembersSearchResult,
} from 'store/storeTypes'
import { InsuranceStatusBadge } from 'utils/agreement'
import { MemberAge } from 'utils/member'
import { MemberSuggestions } from './member-suggestions'

export interface Props {
  searchMemberRequest: (requestArgs: Partial<MemberSearchFilter>) => void
  searchResult: MembersSearchResult
  searchLoading: boolean
}

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
): HTMLInputElement | null =>
  findDOMNode(instance as any) as HTMLInputElement | null

export const MembersSearch: React.FC<Props> = ({
  searchMemberRequest,
  searchResult,
  searchLoading,
}) => {
  const [query, setQuery] = React.useState('')
  const [includeAll, setIncludeAll] = React.useState(false)
  const [hasDispatchedSearch, setHasDispatchedSearch] = React.useState(false)
  const history = useHistory()
  const searchField = useRef<React.ReactElement>()

  useEffect(() => {
    if (searchResult.items.length === 0) {
      searchMemberRequest({})
    }
  }, [])

  return (
    <>
      <Search
        onSubmit={(submittedQuery, submittedIncludeAll) => {
          searchMemberRequest({
            query: submittedQuery !== '' ? submittedQuery : '%',
            includeAll: submittedIncludeAll,
          })
          setHasDispatchedSearch(true)
        }}
        loading={searchLoading}
        query={query}
        setQuery={setQuery}
        includeAll={includeAll}
        setIncludeAll={setIncludeAll}
        currentResultSize={searchResult.items.length}
        searchFieldRef={searchField as any}
      />
      {searchResult.items.length > 0 && (
        <ListWrapper>
          <BackendPaginatorList<MemberSearchResultItem>
            currentPage={searchResult.page}
            totalPages={searchResult.totalPages}
            changePage={(page) =>
              searchMemberRequest({ query, includeAll, page })
            }
            pagedItems={searchResult.items}
            itemContent={(item, isKeyboardHighlighted) => (
              <ListItem
                item={item}
                isKeyboardHighlighted={isKeyboardHighlighted}
              />
            )}
            isSortable={false}
            tableHeader={<ListHeader />}
            keyboardNavigationActive={searchResult.items.length > 0}
            onKeyboardNavigation={() => {
              const inputWrapper =
                searchField.current &&
                findInputFieldDomElementHackishly(searchField.current)
              if (inputWrapper) {
                inputWrapper.querySelector('input')!.blur()
              }
            }}
            onKeyboardSelect={(index) => {
              history.push(
                `/members/${searchResult.items[index].member.memberId}`,
              )
            }}
          />
        </ListWrapper>
      )}
      {searchResult.items.length === 0 && (!hasDispatchedSearch || !query) && (
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

      {searchResult.items.length === 0 &&
        hasDispatchedSearch &&
        query &&
        !searchLoading && (
          <NoMembers>
            <div>D*shborad! No members found</div>
          </NoMembers>
        )}
    </>
  )
}

const Group = styled('div')<{ pushLeft?: boolean }>(({ pushLeft }) => ({
  paddingBottom: '1rem',
  paddingLeft: pushLeft ? '1rem' : 0,
}))
const SearchInputGroup = styled('div')({
  display: 'flex',
  position: 'relative',
  fontSize: '1rem',
  maxWidth: '40rem',
})
const SearchIcon = styled(SearchBootstrapIcon)<{ muted: boolean }>(
  ({ muted, theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '1rem',
    transform: 'translateY(-50%)',
    zIndex: 1,
    fill: muted ? theme.mutedText : undefined,
    transition: 'fill 300ms',
  }),
)

const SearchInput = styled(Input)({
  marginRight: '1rem',

  '&&': {
    width: '100%',
  },

  '&& input': {
    borderRadius: '0.5rem',
    paddingLeft: '3rem',
  },
})
const SearchButton = styled(Button)<{ visible: boolean }>(({ visible }) => ({
  opacity: visible ? 1 : 0,
  transition: 'opacity 400ms',
}))

const EscapeButton = styled(Button)<{ visible: boolean }>(({ visible }) => ({
  opacity: visible ? 1 : 0,
  transition: 'opacity 300ms',
  marginLeft: '2rem',
}))

type SearchFieldProps = {
  onSubmit: (query: string, includeAll: boolean) => void
  loading: boolean
  query: string
  includeAll: boolean
  setQuery: (query: string) => void
  setIncludeAll: (includeAll: boolean) => void
  currentResultSize: number
  searchFieldRef: React.Ref<any>
}
const Search: React.FC<SearchFieldProps> = ({
  onSubmit,
  loading,
  query,
  setQuery,
  includeAll,
  setIncludeAll,
  currentResultSize,
  searchFieldRef,
}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(query, includeAll)
      }}
    >
      <Group>
        <SearchInputGroup>
          <SearchIcon muted={!query} />
          <SearchInput
            onChange={(_, { value }) => setQuery(value)}
            placeholder="Looking for someone...?"
            id="query"
            value={query}
            loading={loading}
            size="big"
            type="search"
            autoFocus
            muted={!query}
            ref={searchFieldRef}
          />
          <SearchButton
            type="submit"
            disabled={loading}
            variation="primary"
            size="large"
            visible={Boolean(query)}
          >
            Search
          </SearchButton>
        </SearchInputGroup>
      </Group>
      <Group pushLeft>
        <Checkbox
          onChange={(_, { checked }) => {
            setIncludeAll(checked!)
            onSubmit(query, checked!)
          }}
          checked={includeAll}
          label="Wide search"
        />

        <EscapeButton
          size="small"
          visible={!query && currentResultSize > 0}
          onClick={() => onSubmit('', false)}
        >
          Clear
        </EscapeButton>
      </Group>
    </form>
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

const MemberAgeWrapper = styled('div')(({ theme }) => ({
  color: theme.mutedText,
  fontSize: '0.8rem',
}))

const ListItem: React.FC<{
  item: MemberSearchResultItem
  isKeyboardHighlighted?: boolean
}> = ({ item, isKeyboardHighlighted }) => {
  const memberStatus =
    item.member.status !== 'SIGNED' ? item.member.status : item.productStatus
  return (
    <Table.Row active={isKeyboardHighlighted}>
      <Table.Cell>
        {item.member.memberId ? (
          <Link to={`/members/${item.member.memberId}`}>
            {item.member.memberId}
          </Link>
        ) : (
          '-'
        )}
      </Table.Cell>
      <Table.Cell>
        {item.member.firstName ?? '-'} {item.member.lastName ?? '-'}
        <MemberAgeWrapper>
          <MemberAge birthDateString={item.member.birthDate} />
        </MemberAgeWrapper>
      </Table.Cell>
      <Table.Cell>
        {item.member.signedOn &&
          format(parseISO(item.member.signedOn), 'MMM d, yyy, HH:ii')}
      </Table.Cell>
      <Table.Cell>{item.firstActiveFrom ?? '-'}</Table.Cell>
      <Table.Cell>{item.lastActiveTo ?? '-'}</Table.Cell>
      <Table.Cell>
        {memberStatus && (
          <InsuranceStatusBadge status={memberStatus}>
            {memberStatus?.toLowerCase()}
          </InsuranceStatusBadge>
        )}
      </Table.Cell>
      <Table.Cell>
        {item.householdSize ?? '-'} people / {item.livingSpace ?? '-'} m
        <sup>2</sup>
      </Table.Cell>
    </Table.Row>
  )
}
