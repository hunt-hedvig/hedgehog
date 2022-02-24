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

const SearchPage: Page = () => {
  const history = useHistory()
  const [query, setQuery] = useState('')
  const { hits, loading, search, fetchMore } = useSearch(query)

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          search()
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
              {hits.map((member, index) => (
                <React.Fragment key={member.memberId}>
                  <TableRow
                    index={index}
                    length={hits.length}
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
                        <Flex align="center" style={{ marginTop: '1rem' }}>
                          <SearchHitExplanation>
                            Search hit in{' '}
                          </SearchHitExplanation>
                          {member.highlights
                            .filter(
                              (highlight) =>
                                !highlight.field.includes('keyword'),
                            )
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
                                  {convertTagText(highlight.field).replaceAll(
                                    '.',
                                    ', ',
                                  )}
                                </Popover>
                              </SearchHitTag>
                            ))}
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
