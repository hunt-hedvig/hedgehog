import React, { useState } from 'react'
import { Flex, Input } from '@hedvig-ui'
import styled from '@emotion/styled'
import {
  Search as SearchBootstrapIcon,
  XCircleFill,
} from 'react-bootstrap-icons'
import chroma from 'chroma-js'

export const SearchIcon = styled(SearchBootstrapIcon)``

const StyledInput = styled(Input)`
  border: none;
  font-size: 1.25rem;

  width: calc(100% - 1.5rem);
`

const Container = styled(Flex)`
  padding: 1rem 1.25rem;
`

const InputContainer = styled.div`
  position: relative;
  width: 100%;
`

const CloseIcon = styled(XCircleFill)`
  position: absolute;
  width: 1.5rem;
  height: 1.5rem;

  top: calc(50% - 0.75rem);
  right: 0.75rem;

  fill: ${({ theme }) => chroma(theme.semiStrongForeground).brighten(2).hex()};
`

export const TriagingPage: React.FC = () => {
  const [query, setQuery] = useState('')

  return (
    <Container>
      <InputContainer>
        <StyledInput
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
          placeholder="What happened?"
          size="large"
          icon={<SearchIcon />}
        />
        <CloseIcon />
      </InputContainer>
    </Container>
  )
}
