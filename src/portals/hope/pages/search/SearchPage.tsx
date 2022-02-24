import { Page } from 'portals/hope/pages/routes'
import {
  Button,
  Flex,
  Input,
  Loadable,
  Placeholder,
  Popover,
  Spacing,
  Table,
  TableBody,
  TableColumn,
  TableHeader,
  TableHeaderColumn,
  TableRow,
} from '@hedvig-ui'
import styled from '@emotion/styled'
import React, { useState } from 'react'
import { SearchIcon } from 'portals/hope/features/members-search/styles'
import { useHistory } from 'react-router'
import { useSearch } from '../../common/hooks/use-search'
import parse from 'html-react-parser'
import chroma from 'chroma-js'
import {
  SearchQuery,
  useMemberSearchResultQuery,
} from 'types/generated/graphql'
import { ArrayElement } from '@hedvig-ui/utils/array-element'
import { MemberAge } from 'portals/hope/features/member/utils'
import formatDate from 'date-fns/format'
import { parseISO } from 'date-fns'
import gql from 'graphql-tag'

type CircleVariation =
  | 'success'
  | 'warning'
  | 'danger'
  | 'accent'
  | 'placeholderColor'

const ContractCountWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const ContractCountNumber = styled.div<{ variation?: CircleVariation }>`
  color: white;
  background-color: ${({ theme, variation = 'accent' }) => theme[variation]};
  padding: 0.2em 0.6em;
  border-radius: 6px;
  font-size: 0.8em;
  min-width: 2em;
  text-align: center;
`

const ContractCountLabel = styled.div`
  font-size: 0.7em;
  color: ${({ theme }) => theme.semiStrongForeground};
  margin-top: 0.3em;
`

const TableColumnSubtext = styled.span`
  font-size: 0.8em;
  color: ${({ theme }) => theme.semiStrongForeground};
`

const MemberAgeWrapper = styled.span`
  font-size: 0.7em;
  margin-left: 0.7em;
  margin-right: -0.7em;
  color: ${({ theme }) => theme.semiStrongForeground};
`

const SearchInput = styled(Input)`
  max-width: 50rem;
  width: 100%;
`

const SearchHitTag = styled.div`
  background-color: ${({ theme }) =>
    chroma(theme.semiStrongForeground).brighten(2.25).alpha(0.5).hex()};
  color: ${({ theme }) => theme.semiStrongForeground};

  padding: 0.15rem 0.3rem;
  font-size: 0.8rem;
  margin-right: 0.5rem;
  border-radius: 0.25rem;
`

const SearchHitExplanation = styled.div`
  color: ${({ theme }) => theme.semiStrongForeground};
  font-size: 0.8rem;
  margin-right: 0.5rem;
`

const convertTagText = (text: string) => {
  const result = text.replaceAll(/([A-Z])/g, ' $1')
  return result.charAt(0).toUpperCase() + result.slice(1)
}

gql`
  query MemberSearchResult($memberId: ID!) {
    member(id: $memberId) {
      memberId
      birthDate
      signedOn
    }
  }
`

const SearchResult: React.FC<{
  result: ArrayElement<SearchQuery['search']>
}> = ({ result }) => {
  const history = useHistory()
  const { data } = useMemberSearchResultQuery({
    variables: { memberId: result.memberId ?? '' },
  })

  return (
    <TableRow
      tabIndex={0}
      onClick={() => history.push(`/members/${result.memberId}/contracts`)}
    >
      <TableColumn style={{ verticalAlign: 'top' }}>
        <Flex direction="column">
          {result.firstName && result.lastName ? (
            `${result.firstName} ${result.lastName}`
          ) : (
            <Placeholder>Not available</Placeholder>
          )}
          <Flex>
            <TableColumnSubtext>{result.memberId}</TableColumnSubtext>
            <MemberAgeWrapper>
              <MemberAge birthDateString={data?.member?.birthDate} />
            </MemberAgeWrapper>
          </Flex>
          {result.highlights.filter(
            (highlight) => !highlight.field.includes('keyword'),
          ).length !== 0 && (
            <Flex align="center" style={{ marginTop: '1rem' }}>
              <SearchHitExplanation>Search hit in </SearchHitExplanation>
              {result.highlights
                .filter((highlight) => !highlight.field.includes('keyword'))
                .map((highlight) => (
                  <SearchHitTag key={highlight.field}>
                    <Popover
                      style={{
                        maxWidth: '60rem',
                        minWidth: '15rem',
                        overflowWrap: 'break-word',
                      }}
                      contents={parse(
                        [...new Set(highlight.values)]
                          .reduce<string>(
                            (acc, value) => acc + value + '<br/>',
                            '',
                          )
                          .replaceAll('<em>', '<b>')
                          .replaceAll('</em>', '</b>'),
                      )}
                    >
                      {convertTagText(highlight.field).replaceAll('.', ', ')}
                    </Popover>
                  </SearchHitTag>
                ))}
            </Flex>
          )}
        </Flex>
      </TableColumn>

      <TableColumn style={{ verticalAlign: 'top' }}>
        {data?.member?.signedOn ? (
          <Flex direction="column">
            {formatDate(parseISO(data?.member?.signedOn), 'dd MMMM, yyyy')}
            <TableColumnSubtext>
              {formatDate(parseISO(data?.member?.signedOn), 'HH:mm')}
            </TableColumnSubtext>
          </Flex>
        ) : (
          <Placeholder>Not available</Placeholder>
        )}
      </TableColumn>

      <TableColumn style={{ verticalAlign: 'top' }}>
        <Loadable loading={true}>
          <span>Not specified</span>
        </Loadable>
      </TableColumn>
      <TableColumn style={{ verticalAlign: 'top' }}>
        <Loadable loading={true}>
          <Placeholder>Not specified</Placeholder>
        </Loadable>
      </TableColumn>
      <TableColumn style={{ verticalAlign: 'top' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Loadable loading={true}>
            <ContractCountWrapper>
              <ContractCountNumber variation="placeholderColor">
                0
              </ContractCountNumber>
              <ContractCountLabel>Pending</ContractCountLabel>
            </ContractCountWrapper>
          </Loadable>
          <Loadable loading={true}>
            <ContractCountWrapper>
              <ContractCountNumber variation="placeholderColor">
                0
              </ContractCountNumber>
              <ContractCountLabel>Active in future</ContractCountLabel>
            </ContractCountWrapper>
          </Loadable>
          <Loadable loading={true}>
            <ContractCountWrapper>
              <ContractCountNumber variation="placeholderColor">
                0
              </ContractCountNumber>
              <ContractCountLabel>Active</ContractCountLabel>
            </ContractCountWrapper>
          </Loadable>
          <Loadable loading={true}>
            <ContractCountWrapper>
              <ContractCountNumber variation="placeholderColor">
                0
              </ContractCountNumber>
              <ContractCountLabel>Terminated</ContractCountLabel>
            </ContractCountWrapper>
          </Loadable>
        </div>
      </TableColumn>
    </TableRow>
  )
}

const useAutoComplete = (query: string) => {
  const { hits } = useSearch(query, {
    minChars: 1,
    debounce: 100,
    type: 'FULL_NAME',
  })

  const suggestion = hits.find((hit) =>
    `${hit.firstName} ${hit.lastName}`
      .toLowerCase()
      .startsWith(query.toLowerCase()),
  )

  return suggestion
}

const SuggestionText = styled.div`
  position: relative;
  top: -2.86rem;
  left: 2.91rem;
  font-size: 18px;
  opacity: 0.25;
  pointer-events: none;
`

const SearchPage: Page = () => {
  const [query, setQuery] = useState('')
  const { hits, loading, search, fetchMore } = useSearch(query, {
    debounce: 500,
    manual: true,
  })
  const suggestion = useAutoComplete(query)

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          search()
        }}
      >
        <div>
          <SearchInput
            onChange={(e) => setQuery(e.currentTarget.value)}
            value={query}
            size="large"
            muted={!query}
            placeholder="What are you looking for?"
            icon={<SearchIcon muted={!query} />}
            loading={loading}
            autoFocus
          />
          {query && suggestion && (
            <SuggestionText>
              {suggestion.firstName + ' ' + suggestion.lastName}
            </SuggestionText>
          )}
        </div>
        <Spacing top />
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
                <React.Fragment key={member.memberId}>
                  <SearchResult result={member} />
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        )}
      </form>
      <Spacing top="medium" />
      <Flex justify="center">
        {hits.length !== 0 && (
          <Button
            variant="tertiary"
            onClick={() => {
              fetchMore()
            }}
          >
            Show more
          </Button>
        )}
      </Flex>
    </>
  )
}

export default SearchPage
