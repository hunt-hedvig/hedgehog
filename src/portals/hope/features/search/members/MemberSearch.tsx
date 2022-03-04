import React, { useState } from 'react'
import { useSearch } from 'portals/hope/common/hooks/use-search'
import { useMemberHistory } from 'portals/hope/features/user/hooks/use-member-history'
import { SearchInput } from 'portals/hope/features/search/SearchInput'
import {
  Button,
  Checkbox,
  fadeIn,
  Flex,
  MainHeadline,
  Spacing,
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

const Instructions = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 1rem;
  padding-top: 2rem;

  code {
    background: ${({ theme }) => theme.backgroundTransparent};
    padding: 1px 2px;
    border-radius: 0.25rem;
  }

  opacity: 0;
  animation: ${fadeIn(0.3)} 1000ms forwards;
  animation-delay: 500ms;
`

const MemberSuggestionsWrapper = styled(Instructions)`
  padding-top: 20vh;
  width: 100%;
  max-width: 50rem;
  animation: ${fadeIn(1)} 1000ms forwards;
  animation-delay: 750ms;
`

export const MemberSearch: React.FC = () => {
  const [wide, setWide] = useState(false)
  const [query, setQuery] = useState('')
  const { hits, loading, search, fetchMore } = useSearch(query)
  const { memberHistory } = useMemberHistory()
  const { suggestionString } = useNameAutoComplete(query)

  return (
    <>
      <SearchInput
        onChange={(value) => setQuery(value)}
        onSearch={() => search()}
        loading={loading}
        suggestion={suggestionString}
      />
      <Checkbox
        onChange={(e) => {
          setWide(e.currentTarget.checked)
          search()
        }}
        checked={wide}
        label="Wide search"
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
      <Spacing top="medium" />
      {hits.length !== 0 && hits.length >= 10 && (
        <Flex justify="center">
          <Button
            disabled={loading}
            variant="tertiary"
            onClick={() => {
              fetchMore()
            }}
          >
            Show more
          </Button>
        </Flex>
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
              <code>street</code>, <code>city</code>, <code>messages</code>
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
