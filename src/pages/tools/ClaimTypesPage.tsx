import styled from '@emotion/styled'
import { Flex, MainHeadline, SecondLevelHeadline, Spacing } from '@hedvig-ui'
import { CreateRelationForm } from 'features/tools/claim-types/CreateRelationForm'
import { ClaimTypeTree } from 'features/tools/claim-types/tree/ClaimTypeTree'
import React from 'react'

const Overview = styled(Flex)`
  background-color: ${({ theme }) => theme.backgroundTransparent};
  width: 100%;
  height: 70vh;
  border-radius: 8px;
`

export const ClaimTypesPage: React.FC = () => {
  return (
    <>
      <Flex direction="row" justify={'space-between'}>
        <MainHeadline>Claim Types</MainHeadline>
      </Flex>
      <Spacing top={'medium'} />
      <Flex direction="row">
        <Overview flex="2">
          <ClaimTypeTree />
        </Overview>
        <Flex
          flex="1"
          direction="column"
          style={{
            padding: '1em',
            marginLeft: '1em',
          }}
        >
          <SecondLevelHeadline>Create relation</SecondLevelHeadline>
          <CreateRelationForm />
        </Flex>
      </Flex>
    </>
  )
}
