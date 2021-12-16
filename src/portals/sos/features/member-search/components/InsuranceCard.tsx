import styled from '@emotion/styled'
import React from 'react'
import { Flex } from '@hedvig-ui'
import chroma from 'chroma-js'

const Card = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  padding: 1.5rem;
  border-radius: 0.75rem;
  width: 25rem;

  border: 1px solid ${({ theme }) => theme.foreground};

  #insurance-name {
    font-size: 1.3rem;
  }

  #insurance-status {
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 1.1rem;
    color: ${({ theme }) => theme.accentContrast};
    background-color: ${({ theme }) =>
      chroma(theme.success).brighten(0.5).hex()};
  }

  #insurance-date {
    font-size: 1rem;
    color: ${({ theme }) => chroma(theme.foreground).brighten(1).hex()};
  }
`

export const InsuranceCard: React.FC = () => {
  return (
    <Card>
      <Flex justify="space-between" align="center">
        <div id="insurance-name">Danish Travel</div>
      </Flex>
      <Flex>
        <div id="insurance-date">2020-01-01 - Ongoing</div>
      </Flex>
    </Card>
  )
}
