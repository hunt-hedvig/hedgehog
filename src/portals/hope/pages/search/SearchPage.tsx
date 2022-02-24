import { Page } from 'portals/hope/pages/routes'
import {
  Button,
  Flex,
  Input,
  Loadable,
  Placeholder,
  Spacing,
  Table,
  TableBody,
  TableColumn,
  TableHeader,
  TableHeaderColumn,
  TableRow,
} from '@hedvig-ui'
import styled from '@emotion/styled'
import React, { useEffect, useState } from 'react'
import { SearchIcon } from 'portals/hope/features/members-search/styles'
import gql from 'graphql-tag'
import { SearchQuery, useSearchLazyQuery } from 'types/generated/graphql'
import { useDebounce } from 'portals/hope/common/hooks/use-debounce'
import { useHistory } from 'react-router'

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

gql`
  query Search($query: String!, $from: Int, $size: Int) {
    search(query: $query, from: $from, size: $size) {
      memberId
      firstName
      lastName
      highlights {
        field
        values
      }
    }
  }
`

const SearchPage: Page = () => {
  const history = useHistory()
  const [result, setResult] = useState<SearchQuery['search']>([])
  const [query, setQuery] = useState('')
  const [search, { loading }] = useSearchLazyQuery({
    variables: { query },
  })

  const debouncedQuery = useDebounce(query, 200)

  useEffect(() => {
    if (debouncedQuery.length >= 3 && !loading) {
      search({ variables: { query: debouncedQuery } }).then(({ data }) => {
        if (!data) {
          return
        }

        setResult(data.search)
      })
    }
  }, [debouncedQuery])

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          search({ variables: { query } })
        }}
      >
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
        <Spacing top />
        {result.length !== 0 && (
          <Table>
            <TableHeader>
              <TableHeaderColumn>Member</TableHeaderColumn>
              <TableHeaderColumn>Signed Up</TableHeaderColumn>
              <TableHeaderColumn>First Master Inception</TableHeaderColumn>
              <TableHeaderColumn>Last Termination Date</TableHeaderColumn>
              <TableHeaderColumn>Contracts</TableHeaderColumn>
            </TableHeader>
            <TableBody>
              {result.map((member, index) => (
                <>
                  <TableRow
                    index={index}
                    length={result.length}
                    key={member.memberId}
                    tabIndex={0}
                    onClick={() =>
                      history.push(`/members/${member.memberId}/contracts`)
                    }
                  >
                    <TableColumn style={{ verticalAlign: 'top' }}>
                      <Flex direction="column">
                        {member.firstName && member.lastName ? (
                          `${member.firstName} ${member.lastName}`
                        ) : (
                          <Placeholder>Not available</Placeholder>
                        )}
                        <Flex>
                          <TableColumnSubtext>
                            {member.memberId}
                          </TableColumnSubtext>
                          <MemberAgeWrapper>
                            <Loadable loading={true}>
                              <span>99 years</span>
                            </Loadable>
                          </MemberAgeWrapper>
                        </Flex>
                      </Flex>
                    </TableColumn>

                    <TableColumn style={{ verticalAlign: 'top' }}>
                      <Flex direction="column">
                        <Loadable loading={true}>
                          <span>Not specified</span>
                        </Loadable>
                        <Loadable loading={true}>
                          <TableColumnSubtext>Not specified</TableColumnSubtext>
                        </Loadable>
                      </Flex>
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
                            <ContractCountLabel>
                              Active in future
                            </ContractCountLabel>
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
                </>
              ))}
            </TableBody>
          </Table>
        )}
      </form>
      <Spacing top="medium" />
      <Flex justify="center">
        {result.length !== 0 && (
          <Button
            variant="tertiary"
            onClick={() => {
              search({
                variables: { query: debouncedQuery, from: result.length },
              }).then(({ data }) => {
                if (!data) {
                  return
                }

                setResult([...result, ...data.search])
              })
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
