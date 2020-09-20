import { Member } from 'api/generated/graphql'
import BackendPaginatorList from 'components/shared/paginator-list/BackendPaginatorList'
import { format, parseISO } from 'date-fns'
import { useMemberSearch } from 'graphql/use-member-search'
import { Button } from 'hedvig-ui/button'
import { Checkbox } from 'hedvig-ui/checkbox'
import { Input } from 'hedvig-ui/input'
import { MainHeadline } from 'hedvig-ui/typography'
import React from 'react'
import { Search as SearchBootstrapIcon } from 'react-bootstrap-icons'
import styled, { keyframes } from 'react-emotion'
import { Link } from 'react-router-dom'
import { Table } from 'semantic-ui-react'
import { InsuranceStatusBadge } from 'utils/agreement'
import { MemberAge } from 'utils/member'
import { MemberSuggestions } from './member-suggestions'

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

export const MembersSearch: React.FC = () => {
  const [query, setQuery] = React.useState('')
  const [includeAll, setIncludeAll] = React.useState(false)

  const [memberSearch, { data, loading }] = useMemberSearch()

  const searchResult = data?.memberSearch
  const members = searchResult?.members ?? []
  const currentResultSize = searchResult?.members.length ?? 0
  const currentPage = searchResult?.page ?? 0
  const totalPages = searchResult?.totalPages ?? 0

  return (
    <>
      <Search
        onSubmit={() => {
          memberSearch(query !== '' ? query : '%', {
            includeAll,
          })
        }}
        loading={loading}
        query={query}
        setQuery={setQuery}
        includeAll={includeAll}
        setIncludeAll={setIncludeAll}
        currentResultSize={currentResultSize}
      />
      {currentResultSize > 0 && (
        <ListWrapper>
          <BackendPaginatorList<Member>
            currentPage={currentPage}
            totalPages={totalPages}
            changePage={(page) =>
              memberSearch(query, { includeAll, page, pageSize: 25 })
            }
            pagedItems={members as Member[]}
            itemContent={(member) => <ListItem member={member} />}
            isSortable={false}
            tableHeader={<ListHeader />}
          />
        </ListWrapper>
      )}
      {currentResultSize === 0 && !query && (
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

      {currentResultSize === 0 && query && !loading && (
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

const MemberAgeWrapper = styled('div')(({ theme }) => ({
  color: theme.mutedText,
  fontSize: '0.8rem',
}))

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
