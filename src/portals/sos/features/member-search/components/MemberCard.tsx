import styled from '@emotion/styled'
import React from 'react'
import chroma from 'chroma-js'

const Card = styled.div`
  padding: 1.5rem;
  background-color: ${({ theme }) =>
    chroma(theme.foreground).brighten(0.5).hex()};
  height: 12rem;
  border-radius: 0.75rem;
  width: 25rem;

  h1 {
    font-size: 1.5rem;
    color: ${({ theme }) => theme.accentContrast};
  }
`

export const MemberCard: React.FC = () => {
  return (
    <Card>
      <h1>Rasmus Guterstam</h1>
    </Card>
  )
}
