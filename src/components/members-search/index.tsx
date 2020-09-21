import { Member } from 'api/generated/graphql'
import {
  EscapeButton,
  ExtraInstruction,
  Group,
  Instructions,
  ListWrapper,
  MemberAgeWrapper,
  MemberSuggestionsWrapper,
  NoMembers,
  SearchButton,
  SearchIcon,
  SearchInput,
  SearchInputGroup,
} from 'components/members-search/styles'
import BackendPaginatorList from 'components/shared/paginator-list/BackendPaginatorList'
import { format, parseISO } from 'date-fns'
import { useMemberSearch } from 'graphql/use-member-search'
import { Checkbox } from 'hedvig-ui/checkbox'
import { MainHeadline } from 'hedvig-ui/typography'
import React from 'react'
import { Link } from 'react-router-dom'
import { Table } from 'semantic-ui-react'
import { InsuranceStatusBadge } from 'utils/agreement'
import { MemberAge } from 'utils/member'
import { MemberSuggestions } from './member-suggestions'

export const MembersSearch: React.FC = () => {
  const [query, setQuery] = React.useState('')
  const [includeAll, setIncludeAll] = React.useState(false)

  const [memberSearch, { data, loading }] = useMemberSearch()
  const { members = [], page = 0, totalPages = 0 } = { ...data?.memberSearch }

  const noMembersFound = members.length === 0 && query && !loading

  return (
    <>
      <Search
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
      />
      {members.length > 0 && (
        <ListWrapper>
          <BackendPaginatorList<Member>
            currentPage={page}
            totalPages={totalPages}
            changePage={(nextPage) =>
              memberSearch(query, { includeAll, page: nextPage, pageSize: 25 })
            }
            pagedItems={members as Member[]}
            itemContent={(member) => <ListItem member={member} />}
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

const Search: React.FC<{
  onSubmit: (query: string, includeAll: boolean) => void
  loading: boolean
  query: string
  includeAll: boolean
  setQuery: (query: string) => void
  setIncludeAll: (includeAll: boolean) => void
  currentResultSize: number
}> = ({
  onSubmit,
  loading,
  query,
  setQuery,
  includeAll,
  setIncludeAll,
  currentResultSize,
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

const ListItem: React.FC<{ member: Member }> = ({ member }) => {
  // TODO: @Elvin, is productStatus something from ProductPricing? Verify what to resolve
  // const memberStatus =
  //  member.status !== 'SIGNED' ? member.status : item.productStatus

  const memberStatus = member?.status ?? null

  return (
    <Table.Row>
      <Table.Cell>
        {member.memberId ? (
          <Link to={`/members/${member.memberId}`}>{member.memberId}</Link>
        ) : (
          '-'
        )}
      </Table.Cell>
      <Table.Cell>
        {member.firstName ?? '-'} {member.lastName ?? '-'}
        <MemberAgeWrapper>
          <MemberAge birthDateString={member.birthDate} />
        </MemberAgeWrapper>
      </Table.Cell>
      <Table.Cell>
        {member.signedOn &&
          format(parseISO(member.signedOn), 'MMM d, yyy, HH:ii')}
      </Table.Cell>
      <Table.Cell>{'firstActiveFrom'}</Table.Cell>
      <Table.Cell>{'lastActiveTo'}</Table.Cell>
      <Table.Cell>
        {memberStatus && (
          <InsuranceStatusBadge status={memberStatus}>
            {memberStatus?.toLowerCase()}
          </InsuranceStatusBadge>
        )}
      </Table.Cell>
      <Table.Cell>householdSize</Table.Cell>
    </Table.Row>
  )
}
