import React, { useEffect, useRef, useState } from 'react'
import {
  ChevronRight,
  Search as SearchIcon,
  XCircleFill,
} from 'react-bootstrap-icons'
import styled from '@emotion/styled'
import { Input } from '@hedvig-ui'
import chroma from 'chroma-js'
import { motion } from 'framer-motion'
import gql from 'graphql-tag'
import {
  SearchClaimTypeQuery,
  useSearchClaimTypeLazyQuery,
} from 'types/generated/graphql'
import { useDebounce } from 'portals/hope/common/hooks/use-debounce'
import { convertEnumOrSentenceToTitle } from '@hedvig-ui/utils/text'

const StyledInput = styled(Input)`
  border: none;
  font-size: 1.25rem;

  width: calc(100% - 1.5rem);
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
`

const InputContainer = styled.div`
  position: relative;
  width: 100%;
`

const ResultContainer = styled.div`
  display: flex;
  flex-direction: column;

  margin-top: 1rem;
  padding: 0 1.2rem;
`

const CloseIcon = styled(XCircleFill)`
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  position: absolute;
  width: 1.5rem;
  height: 1.5rem;

  top: calc(50% - 0.75rem);
  right: 0.75rem;

  fill: ${({ theme }) => chroma(theme.semiStrongForeground).brighten(2).hex()};
`

const SearchHitRow = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 100%;

  padding: 1rem 0;
  user-select: none;
`

gql`
  query SearchClaimType($query: String!) {
    searchClaimType(query: $query) {
      claimType
      score
    }
  }
`

type SearchHit = SearchClaimTypeQuery['searchClaimType'][0]

const useSearchClaimType = (query: string) => {
  const [result, setResult] = useState<SearchHit[]>([])
  const [search, { refetch, data }] = useSearchClaimTypeLazyQuery()

  useEffect(() => {
    if (!query) setResult([])
  }, [query])

  const searchHandler = () => {
    if (result.length === 0) {
      // Lovely bug, need to refetch after first search
      search({
        variables: {
          query,
        },
      })
      return
    }

    refetch({
      query,
    })
  }

  useEffect(() => {
    if (data?.searchClaimType) setResult(data.searchClaimType as SearchHit[])
  }, [data])

  return { search: searchHandler, hits: result }
}

export const TriagingSearchPage: React.FC<{
  onSelect: (option: string) => void
}> = ({ onSelect }) => {
  const [query, setQuery] = useState('')
  const { search, hits } = useSearchClaimType(query)
  const inputRef = useRef<HTMLInputElement>(null)

  const debouncedValue = useDebounce(query, 100)

  useEffect(() => search(), [debouncedValue])

  return (
    <div style={{ padding: '0 1.25rem' }}>
      <InputContainer>
        <StyledInput
          value={query}
          ref={inputRef}
          onChange={(e) => setQuery(e.currentTarget.value)}
          placeholder="What happened?"
          size="large"
          icon={<SearchIcon />}
        />
        {query && (
          <CloseIcon
            onClick={() => {
              setQuery('')
              inputRef.current?.focus()
            }}
          />
        )}
      </InputContainer>
      <ResultContainer>
        {hits.map(({ claimType }) => (
          <SearchHitRow
            key={claimType}
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelect(convertEnumOrSentenceToTitle(claimType))}
          >
            <div>{convertEnumOrSentenceToTitle(claimType)}</div>
            <ChevronRight />
          </SearchHitRow>
        ))}
        {hits.length >= 1 && (
          <SearchHitRow
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelect('Other')}
          >
            <div>Other</div>
            <ChevronRight />
          </SearchHitRow>
        )}
      </ResultContainer>
    </div>
  )
}
