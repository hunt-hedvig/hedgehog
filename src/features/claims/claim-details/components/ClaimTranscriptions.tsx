import { useClaimPageQuery } from 'types/generated/graphql'

import React from 'react'

import styled from '@emotion/styled'
import { Card, CardContent, List, ListItem, Paragraph } from '@hedvig-ui'
import { CardTitle } from 'features/claims/claim-details/components/claim-items/CardTitle'
import { BugFill } from 'react-bootstrap-icons'

const ClaimTranscriptionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const ClaimTranscription = styled(Paragraph)`
  font-size: 1rem;
  max-width: 80%;
  white-space: pre-wrap;
`

const ClaimTranscriptionMetaData = styled(Paragraph)`
  font-size: 0.875rem;
  text-align: right;
`

const ClaimTranscriptions: React.FC<{ claimId: string }> = ({ claimId }) => {
  const {
    data: claimTranscriptionsData,
    error: queryError,
  } = useClaimPageQuery({
    variables: { claimId },
  })

  if (!claimTranscriptionsData?.claim?.transcriptions.length) {
    return null
  }

  return (
    <Card>
      <CardContent>
        <CardTitle
          title={'Transcription'}
          badge={
            queryError
              ? {
                  icon: BugFill,
                  status: 'danger',
                  label: 'Internal Error',
                }
              : null
          }
        />

        <List>
          {claimTranscriptionsData?.claim?.transcriptions?.map(
            (transcription) => (
              <ListItem key={transcription.text}>
                <ClaimTranscriptionWrapper>
                  <ClaimTranscription>{transcription.text}</ClaimTranscription>
                  <List>
                    <ClaimTranscriptionMetaData>
                      Confidence: {transcription.confidenceScore}
                      <br /> Language code: {transcription.languageCode}
                    </ClaimTranscriptionMetaData>
                  </List>
                </ClaimTranscriptionWrapper>
              </ListItem>
            ),
          )}
        </List>
      </CardContent>
    </Card>
  )
}

export { ClaimTranscriptions }
