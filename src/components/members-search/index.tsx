import { Member } from 'api/generated/graphql'
import { ListHeader } from 'components/members-search/components/ListHeader'
import { ListItem } from 'components/members-search/components/ListItem'
import { SearchForm } from 'components/members-search/components/SearchForm'
import {
  ExtraInstruction,
  Instructions,
  ListWrapper,
  MemberSuggestionsWrapper,
  NoMembers,
} from 'components/members-search/styles'
import BackendPaginatorList from 'components/shared/paginator-list/BackendPaginatorList'
import { useMemberSearch } from 'graphql/use-member-search'
import { MainHeadline } from 'hedvig-ui/typography'
import React from 'react'
import { MemberSuggestions } from './components/MemberSuggestions'

export const MembersSearch: React.FC = () => {
  const [query, setQuery] = React.useState('')
  const [includeAll, setIncludeAll] = React.useState(false)

  const [memberSearch, { data, loading }] = useMemberSearch()
  const { members = [], page = 0, totalPages = 0 } = { ...data?.memberSearch }

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
