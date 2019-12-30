import { colorsV2 } from '@hedviginsurance/brand/dist'
import BackendPaginatorList from 'components/shared/paginator-list/BackendPaginatorList'
import * as React from 'react'
import styled, { keyframes } from 'react-emotion'
import { Mount } from 'react-lifecycle-components'
import { Link } from 'react-router-dom'
import { Button, Checkbox, Input, Label, Table } from 'semantic-ui-react'
import {
  MemberSearchFilter,
  MemberSearchResultItem,
  MembersSearchResult,
} from 'store/storeTypes'

export interface Props {
  searchMemberRequest: (
    requestArgs: Partial<MemberSearchFilter>,
  ) => Promise<void>
  searchResult: MembersSearchResult
  searchLoading: boolean
}

const fadeIn = (max: number) =>
  keyframes({
    from: { opacity: 0, transform: 'translateY(5%)' },
    to: { opacity: max, transform: 'translateY(0)' },
  })

const Instructions = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  textAlign: 'center',
  code: {
    background: 'rgba(0, 0, 0, .1)',
    padding: '1px 2px',
    borderRadius: 1,
  },
  opacity: 0,
  animation: `${fadeIn(0.5)} 1000ms forwards`,
  animationDelay: '1000ms',
})

const ExtraInstruction = styled('div')({
  opacity: 0,
  animation: `${fadeIn(1)} 1000ms forwards`,
  animationDelay: '1000ms',
})

export const MembersSearch: React.FC<Props> = ({
  searchMemberRequest,
  searchResult,
  searchLoading,
}) => {
  const [query, setQuery] = React.useState('')
  const [includeAll, setIncludeAll] = React.useState(false)
  const [hasDispatchedSearch, setHasDispatchedSearch] = React.useState(false)

  return (
    <Mount
      on={() => {
        if (searchResult.items.length === 0) {
          searchMemberRequest({})
        }
      }}
    >
      <>
        <Search
          onSubmit={(query, includeAll) => {
            searchMemberRequest({ query, includeAll })
            setHasDispatchedSearch(true)
          }}
          loading={searchLoading}
          query={query}
          setQuery={setQuery}
          includeAll={includeAll}
          setIncludeAll={setIncludeAll}
        />
        {searchResult.items.length > 0 && (
          <BackendPaginatorList<MemberSearchResultItem>
            currentPage={searchResult.page}
            totalPages={searchResult.totalPages}
            changePage={(page) =>
              searchMemberRequest({ query, includeAll, page })
            }
            pagedItems={searchResult.items}
            itemContent={(item) => <ListItem item={item} />}
            isSortable={false}
            keyName="memberId"
            tableHeader={<ListHeader />}
          />
        )}
        {searchResult.items.length === 0 && (!hasDispatchedSearch || !query) && (
          <Instructions>
            <h1>Search for members</h1>
            <div>
              Search by <strong>member id</strong>,{' '}
              <strong>personnummer</strong>, <strong>email</strong>,{' '}
              <strong>phone</strong> or <strong>name</strong>
            </div>
            <div>
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
    </Mount>
  )
}

const Group = styled('div')({
  paddingBottom: '1rem',
})
const SearchInputGroup = styled('div')({
  display: 'flex',
})
const SearchInput = styled(Input)({
  '&& input, &&': {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    width: '100%',
    border: 0,
  },
  '&& input': {
    border: '1px solid ' + colorsV2.violet300,
  },
})
const SearchButton = styled(Button)({
  '&&&': {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    background: colorsV2.violet300,
    color: '#fff',
  },
})

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
        <div>
          <Label htmlFor="query" size="big">
            Query
          </Label>
        </div>
        <SearchInputGroup>
          <SearchInput
            onChange={(_, { value }) => setQuery(value)}
            placeholder="Looking for someone...?"
            id="query"
            value={query}
            loading={loading}
            size="big"
            type="search"
            autoFocus
          />
          <SearchButton type="submit" disabled={loading} size="big">
            Search
          </SearchButton>
        </SearchInputGroup>
      </Group>
      <Group>
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
    <Table.HeaderCell>Member id</Table.HeaderCell>
    <Table.HeaderCell>Name</Table.HeaderCell>
    <Table.HeaderCell>Sign up</Table.HeaderCell>
    <Table.HeaderCell>Active from</Table.HeaderCell>
    <Table.HeaderCell>Active to</Table.HeaderCell>
    <Table.HeaderCell>Status</Table.HeaderCell>
    <Table.HeaderCell>Size</Table.HeaderCell>
  </Table.Header>
)

const ListItem: React.FC<{ item: MemberSearchResultItem }> = ({ item }) => (
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
    </Table.Cell>
    <Table.Cell>{item.member.signedOn}</Table.Cell>
    <Table.Cell>{item.firstActiveFrom ?? '-'}</Table.Cell>
    <Table.Cell>{item.lastActiveTo ?? '-'}</Table.Cell>
    <Table.Cell>
      {(item.member.status !== 'SIGNED'
        ? item.member.status
        : item.productStatus) ?? '-'}
    </Table.Cell>
    <Table.Cell>
      {item.householdSize ?? '-'} people / {item.livingSpace ?? '-'} m
      <sup>2</sup>
    </Table.Cell>
  </Table.Row>
)
