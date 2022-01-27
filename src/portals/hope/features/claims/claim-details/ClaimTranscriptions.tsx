import React from 'react'

import styled from '@emotion/styled'
import { CardContent, CardTitle, List, ListItem, Paragraph } from '@hedvig-ui'
import { useClaimTranscriptionsQuery } from 'types/generated/graphql'
import gql from 'graphql-tag'

const ClaimTranscriptionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const Transcription = styled(Paragraph)`
  font-size: 1rem;
  max-width: 80%;
  white-space: pre-wrap;
`

const ClaimTranscriptionMetaData = styled(Paragraph)`
  font-size: 0.875rem;
  text-align: right;
`

gql`
  query ClaimTranscriptions($claimId: ID!) {
    claim(id: $claimId) {
      id
      transcriptions {
        text
        confidenceScore
        languageCode
      }
    }
  }
`

const ClaimTranscriptions: React.FC<{
  claimId: string
}> = ({ claimId }) => {
  const { data } = useClaimTranscriptionsQuery({ variables: { claimId } })

  const transcriptions = data?.claim?.transcriptions ?? []

  return (
    <CardContent>
      <CardTitle title="Transcription" />

      <List>
        {transcriptions.map((transcription) => (
          <ListItem key={transcription.text}>
            <ClaimTranscriptionWrapper>
              <Transcription>{transcription.text}</Transcription>
              <List>
                <ClaimTranscriptionMetaData>
                  Confidence: {transcription.confidenceScore}
                  <br /> Language code: {transcription.languageCode}
                </ClaimTranscriptionMetaData>
              </List>
            </ClaimTranscriptionWrapper>
          </ListItem>
        ))}
      </List>
    </CardContent>
  )
}

export { ClaimTranscriptions }
