import { convertCamelcaseToTitle } from '@hedvig-ui/utils/text'
import React from 'react'
import { ArrayElement } from '@hedvig-ui/utils/array-element'
import {
  ContractStatus,
  MemberSearchHit,
  SearchQuery,
} from 'types/generated/graphql'
import {
  Flex,
  Loadable,
  Placeholder,
  Popover,
  TableColumn,
  TableRow,
} from '@hedvig-ui'
import { getMemberFlag, MemberAge } from 'portals/hope/features/member/utils'
import parse from 'html-react-parser'
import formatDate from 'date-fns/format'
import { parseISO } from 'date-fns'
import {
  getFirstMasterInception,
  getLastTerminationDate,
} from 'portals/hope/features/member/tabs/contracts-tab/utils'
import styled from '@emotion/styled'
import chroma from 'chroma-js'
import { useMemberSearchContracts } from 'portals/hope/features/search/members/hooks/use-member-search-contracts'

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

const Tag = styled.div`
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
  const result = text.split('.').map((word) => convertCamelcaseToTitle(word))
  return result.join(' → ')
}

const SearchHitTag: React.FC<{
  highlight: ArrayElement<SearchQuery['search'][0]['highlights']>
}> = ({ highlight }) => {
  const contents = parse(
    [...new Set(highlight.values)]
      ?.reduce<string>((acc, value) => acc + value + '<br/>', '')
      ?.replaceAll('<em>', '<b>')
      ?.replaceAll('</em>', '</b>') ?? '',
  )

  console.warn(contents)

  return (
    <Tag>
      <Popover
        style={{
          maxWidth: '60rem',
          minWidth: '15rem',
          overflowWrap: 'break-word',
        }}
        contents={contents}
      >
        {convertTagText(highlight.field).replaceAll('.', ', ')}
      </Popover>
    </Tag>
  )
}

export const MemberHitRow: React.FC<{
  result: ArrayElement<SearchQuery['search']>
}> = ({ result }) => {
  const { member, loading, groupBy, contracts } = useMemberSearchContracts(
    result.hit.memberId ?? '',
  )

  const hit = result.hit as MemberSearchHit

  const contractsByStatus = groupBy('status')

  const filteredResults = result.highlights.filter(
    (highlight) => !highlight.field.includes('keyword'),
  )

  return (
    <TableRow
      tabIndex={0}
      onClick={() => window.open(`/members/${result.hit.memberId}/contracts`)}
    >
      <TableColumn style={{ verticalAlign: 'top' }}>
        <Flex direction="column">
          {hit.firstName && hit.lastName ? (
            `${hit.firstName} ${hit.lastName}`
          ) : (
            <Placeholder>Not available</Placeholder>
          )}{' '}
          {member?.contractMarketInfo &&
            getMemberFlag(member.contractMarketInfo)}
          <Flex>
            <TableColumnSubtext>{hit.memberId}</TableColumnSubtext>
            <MemberAgeWrapper>
              <MemberAge birthDateString={member?.birthDate} />
            </MemberAgeWrapper>
          </Flex>
          {filteredResults.length !== 0 && (
            <Flex align="center" style={{ marginTop: '1rem' }}>
              <SearchHitExplanation>Search hit in </SearchHitExplanation>
              {filteredResults.map((highlight) => (
                <SearchHitTag key={highlight.field} highlight={highlight} />
              ))}
            </Flex>
          )}
        </Flex>
      </TableColumn>

      <TableColumn style={{ verticalAlign: 'top' }}>
        {member?.signedOn ? (
          <Flex direction="column">
            {formatDate(parseISO(member?.signedOn), 'dd MMMM, yyyy')}
            <TableColumnSubtext>
              {formatDate(parseISO(member?.signedOn), 'HH:mm')}
            </TableColumnSubtext>
          </Flex>
        ) : (
          <Placeholder>Not available</Placeholder>
        )}
      </TableColumn>

      <TableColumn style={{ verticalAlign: 'top' }}>
        <Loadable loading={loading}>
          {getFirstMasterInception(contracts) ?? (
            <Placeholder>Not specified</Placeholder>
          )}
        </Loadable>
      </TableColumn>
      <TableColumn style={{ verticalAlign: 'top' }}>
        <Loadable loading={loading}>
          {getLastTerminationDate(contracts) ?? (
            <Placeholder>Not specified</Placeholder>
          )}
        </Loadable>
      </TableColumn>

      <TableColumn style={{ verticalAlign: 'top' }}>
        <Flex justify="space-between">
          <Loadable loading={loading}>
            <ContractCountWrapper>
              <ContractCountNumber
                variation={
                  contractsByStatus[ContractStatus.Pending]?.length ?? 0
                    ? 'warning'
                    : 'placeholderColor'
                }
              >
                {contractsByStatus[ContractStatus.Pending]?.length ?? 0}
              </ContractCountNumber>
              <ContractCountLabel>Pending</ContractCountLabel>
            </ContractCountWrapper>
          </Loadable>
          <Loadable loading={loading}>
            <ContractCountWrapper>
              <ContractCountNumber
                variation={
                  contractsByStatus[ContractStatus.ActiveInFuture]?.length ?? 0
                    ? 'accent'
                    : 'placeholderColor'
                }
              >
                {contractsByStatus[ContractStatus.ActiveInFuture]?.length ?? 0}
              </ContractCountNumber>
              <ContractCountLabel>Active in future</ContractCountLabel>
            </ContractCountWrapper>
          </Loadable>
          <Loadable loading={loading}>
            <ContractCountWrapper>
              <ContractCountNumber
                variation={
                  contractsByStatus[ContractStatus.Active]?.length ?? 0
                    ? 'success'
                    : 'placeholderColor'
                }
              >
                {contractsByStatus[ContractStatus.Active]?.length ?? 0}
              </ContractCountNumber>
              <ContractCountLabel>Active</ContractCountLabel>
            </ContractCountWrapper>
          </Loadable>
          <Loadable loading={loading}>
            <ContractCountWrapper>
              <ContractCountNumber
                variation={
                  contractsByStatus[ContractStatus.Terminated]?.length ?? 0
                    ? 'danger'
                    : 'placeholderColor'
                }
              >
                {contractsByStatus[ContractStatus.Terminated]?.length ?? 0}
              </ContractCountNumber>
              <ContractCountLabel>Terminated</ContractCountLabel>
            </ContractCountWrapper>
          </Loadable>
        </Flex>
      </TableColumn>
    </TableRow>
  )
}
