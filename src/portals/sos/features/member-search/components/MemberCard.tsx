import styled from '@emotion/styled'
import React from 'react'
import chroma from 'chroma-js'
import { Flex } from '@hedvig-ui'

const Card = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  padding: 1.5rem;
  background-color: ${({ theme }) =>
    chroma(theme.foreground).brighten(0.5).hex()};
  height: 12rem;
  border-radius: 0.75rem;
  width: 25rem;

  #member-name {
    font-size: 1.5rem;
    color: ${({ theme }) => theme.accentContrast};
  }

  #member-id {
    font-size: 1rem;
    color: ${({ theme }) => chroma(theme.accentContrast).darken(1).hex()};
  }

  #member-market {
    font-size: 1rem;
    display: inline-block;
    padding: 0.2rem 0.5rem;
    border-radius: 0.5rem;
    background-color: ${({ theme }) =>
      chroma(theme.background).alpha(0.2).hex()};

    color: ${({ theme }) => theme.accentContrast};
  }
`

export const MemberCard: React.FC = () => {
  return (
    <Card>
      <div>
        <div id="member-name">Rasmus Guterstam</div>
        <div id="member-id">123456789</div>
      </div>
      <Flex justify="flex-end" align="flex-end">
        <div id="member-market">🇩🇰 Denmark</div>
      </Flex>
    </Card>
  )
}
