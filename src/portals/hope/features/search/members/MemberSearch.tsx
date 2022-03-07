import React, { useEffect, useState } from 'react'
import { useSearch } from 'portals/hope/common/hooks/use-search'
import { useMemberHistory } from 'portals/hope/features/user/hooks/use-member-history'
import { SearchInput } from 'portals/hope/features/search/components/SearchInput'
import {
  Button,
  fadeIn,
  Flex,
  MainHeadline,
  Spacing,
  StandaloneMessage,
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
} from '@hedvig-ui'
import { ExtraInstruction } from 'portals/hope/features/members-search/styles'
import { MemberSuggestions } from 'portals/hope/features/members-search/components/MemberSuggestions'
import styled from '@emotion/styled'
import { MemberHitRow } from 'portals/hope/features/search/members/components/MemberHitRow'
import { useNameAutoComplete } from 'portals/hope/features/search/members/hooks/use-name-autocomplete'
import { SearchCategoryButtons } from 'portals/hope/features/search/components/SearchCategoryButtons'
import { useHistory } from 'react-router'
import { Instructions } from 'portals/hope/features/search/components/Instructions'

const MemberSuggestionsWrapper = styled(Instructions)`
  padding-top: 20vh;
  width: 100%;
  max-width: 50rem;
  animation: ${fadeIn(1)} 1000ms forwards;
  animation-delay: 750ms;
`

export const MemberSearch: React.FC = () => {
  const history = useHistory()
  const [query, setQuery] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const { hits, loading, search, fetchMore } = useSearch(query)
  const { memberHistory } = useMemberHistory()
  const { suggestionString } = useNameAutoComplete(query)

  useEffect(() => {
    setHasSearched(false)
  }, [query])

  return (
    <>
      <SearchInput
        onChange={(value) => setQuery(value)}
        onSearch={() => {
          search()
          setHasSearched(true)
        }}
        loading={loading}
        suggestion={suggestionString}
      />

      <SearchCategoryButtons
        category="members"
        onChange={(category) => history.push(`/search/${category}`)}
      />

      <Spacing top="large" />

      {hits.length !== 0 && (
        <Table>
          <TableHeader>
            <TableHeaderColumn>Member</TableHeaderColumn>
            <TableHeaderColumn>Signed Up</TableHeaderColumn>
            <TableHeaderColumn>First Master Inception</TableHeaderColumn>
            <TableHeaderColumn>Last Termination Date</TableHeaderColumn>
            <TableHeaderColumn>Contracts</TableHeaderColumn>
          </TableHeader>
          <TableBody>
            {hits.map((member) => (
              <MemberHitRow key={member.hit.memberId} result={member} />
            ))}
          </TableBody>
        </Table>
      )}
      {hits.length === 0 && query && hasSearched && (
        <StandaloneMessage>No results</StandaloneMessage>
      )}
      {hits.length !== 0 && hits.length >= 10 && (
        <>
          <Spacing top="medium" />
          <Flex justify="center">
            <Button
              disabled={loading}
              variant="tertiary"
              onClick={() => fetchMore()}
            >
              Show more
            </Button>
          </Flex>
        </>
      )}
      {hits.length === 0 && !query && (
        <div>
          <Instructions>
            <h1>Search for members</h1>
            <div>
              Search for anything related to a member, such as
              <br />
              <code>name</code>, <code>member ID</code>, <code>SSN</code>,{' '}
              <code>email</code>, <code>phone</code>, <code>claim notes</code>{' '}
              <br />
              <code>street</code>, <code>postal code</code>, <code>city</code>,{' '}
              <code>messages</code>
            </div>
            {query && (
              <ExtraInstruction>Press enter to search</ExtraInstruction>
            )}
          </Instructions>

          <MemberSuggestionsWrapper>
            <MainHeadline>Suggestions</MainHeadline>
            <MemberSuggestions suggestions={memberHistory} />
          </MemberSuggestionsWrapper>
        </div>
      )}
    </>
  )
}
