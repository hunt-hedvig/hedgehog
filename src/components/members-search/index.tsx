import BackendPaginatorList from 'components/shared/paginator-list/BackendPaginatorList'
import { Button } from 'hedvig-ui/button'
import { Checkbox } from 'hedvig-ui/checkbox'
import { Input } from 'hedvig-ui/input'
import { match } from 'matchly'
import React, { useEffect } from 'react'
import { Search as SearchBootstrapIcon } from 'react-bootstrap-icons'
import styled, { keyframes } from 'react-emotion'
import { Link } from 'react-router-dom'
import { Table } from 'semantic-ui-react'
import {
  MemberSearchFilter,
  MemberSearchResultItem,
  MembersSearchResult,
} from 'store/storeTypes'
import { MemberAge } from 'utils/member'

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
  animationDelay: '1000ms',
}))

const ExtraInstruction = styled('div')({
  opacity: 0,
  animation: `${fadeIn(1)} 1000ms forwards`,
  animationDelay: '1000ms',
})

const ListWrapper = styled('div')({
  paddingLeft: '1rem',
})

export const MembersSearch: React.FC<Props> = ({
  searchMemberRequest,
  searchResult,
  searchLoading,
}) => {
  const [query, setQuery] = React.useState('')
  const [includeAll, setIncludeAll] = React.useState(false)
  const [hasDispatchedSearch, setHasDispatchedSearch] = React.useState(false)

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
            query: submittedQuery,
            includeAll: submittedIncludeAll,
          })
          setHasDispatchedSearch(true)
        }}
        loading={searchLoading}
        query={query}
        setQuery={setQuery}
        includeAll={includeAll}
        setIncludeAll={setIncludeAll}
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
            itemContent={(item) => <ListItem item={item} />}
            isSortable={false}
            tableHeader={<ListHeader />}
          />
        </ListWrapper>
      )}
      {searchResult.items.length === 0 && (!hasDispatchedSearch || !query) && (
        <Instructions>
          <h1>Search for members</h1>
          <div>
            Search by <em>member id</em>, <em>personnummer</em>, <em>email</em>,{' '}
            <em>phone</em> or <em>name</em>
          </div>
          <div>
            <br />
            <code>%</code> is a wildcard character, it can be used to search for
            anything
          </div>
          <div>
            Example: <code>He%g</code> will match both <code>Hedvig</code> and{' '}
            <code>Hedgehog</code>
          </div>
          {query && <ExtraInstruction>Press enter to search</ExtraInstruction>}
        </Instructions>
      )}

      {searchResult.items.length === 0 &&
        hasDispatchedSearch &&
        query &&
        !searchLoading && (
          <Instructions>
            <div>D*shborad 🤬!</div>
            <div>
              <strong>No members found</strong>
            </div>
          </Instructions>
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
    width: 'calc(100% - 1rem)',
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

const Search: React.FC<{
  onSubmit: (query: string, includeAll: boolean) => void
  loading: boolean
  query: string
  includeAll: boolean
  setQuery: (query: string) => void
  setIncludeAll: (includeAll: boolean) => void
}> = ({ onSubmit, loading, query, setQuery, includeAll, setIncludeAll }) => {
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
      </Group>
    </form>
  )
}
const ListHeader: React.FC = () => (
  <Table.Header>
    <Table.HeaderCell>Member</Table.HeaderCell>
    <Table.HeaderCell></Table.HeaderCell>
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

const StatusBadge = styled('div')<{ status: string }>(({ theme, status }) => ({
  display: 'inline-block',
  fontSize: '0.8rem',
  padding: '0.25rem 0.8rem',
  backgroundColor: match([
    ['ACTIVE', theme.activeInsuranceBackground],
    ['PENDING', theme.pendingInsuranceBackground],
    ['TERMINATED', theme.terminatedInsuranceBackground],
    [match.any(), theme.mutedBackground],
  ])(status),
  color: match([
    ['ACTIVE', theme.activeInsuranceForeground],
    ['PENDING', theme.pendingInsuranceForeground],
    ['TERMINATED', theme.terminatedInsuranceForeground],
    [match.any(), theme.mutedText],
  ])(status),
  textTransform: 'capitalize',
  borderRadius: '1000px',
}))

const ListItem: React.FC<{ item: MemberSearchResultItem }> = ({ item }) => {
  const memberStatus =
    item.member.status !== 'SIGNED' ? item.member.status : item.productStatus
  return (
    <Table.Row>
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
      <Table.Cell>{item.member.signedOn}</Table.Cell>
      <Table.Cell>{item.firstActiveFrom ?? '-'}</Table.Cell>
      <Table.Cell>{item.lastActiveTo ?? '-'}</Table.Cell>
      <Table.Cell>
        {memberStatus && (
          <StatusBadge status={memberStatus}>
            {memberStatus?.toLowerCase()}
          </StatusBadge>
        )}
      </Table.Cell>
      <Table.Cell>
        {item.householdSize ?? '-'} people / {item.livingSpace ?? '-'} m
        <sup>2</sup>
      </Table.Cell>
    </Table.Row>
  )
}
