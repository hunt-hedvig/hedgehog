import {
  List as MuiList,
  ListItem as MuiListItem,
  Typography as MuiTypography,
  withStyles,
} from '@material-ui/core'
import { useClaimTranscriptionsQuery } from 'api/generated/graphql'

import React from 'react'

import { Paper } from '../../../shared/Paper'

interface Props {
  claimId: string
}

const ListItem = withStyles({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 0,
    paddingRight: 0,
    borderBottom: '1px solid rgba(0,0,0,0.08)',
  },
})(MuiListItem)

const ClaimTranscription = withStyles({
  root: {
    fontSize: '1rem',
    maxWidth: '80%',
  },
})(MuiTypography)

const ClaimTranscriptionMetaData = withStyles({
  root: {
    fontSize: '0.875rem',
  },
})(MuiTypography)

const ClaimTranscriptions: React.FC<Props> = ({ claimId }) => {
  const { data: claimTranscriptionsData } = useClaimTranscriptionsQuery({
    variables: { claimId },
  })

  if (!claimTranscriptionsData?.claim?.transcriptions.length) {
    return null
  }

  return (
    <Paper>
      <h3>Transcription</h3>
      <MuiList>
        {claimTranscriptionsData?.claim?.transcriptions?.map(
          (transcription) => (
            <ListItem key={transcription.text}>
              <ClaimTranscription component="p">
                {transcription.text}
              </ClaimTranscription>
              <MuiList>
                <ClaimTranscriptionMetaData component="span">
                  Confidence: {transcription.confidenceScore}
                  <br /> Language code: {transcription.languageCode}
                </ClaimTranscriptionMetaData>
              </MuiList>
            </ListItem>
          ),
        )}
      </MuiList>
    </Paper>
  )
}

export { ClaimTranscriptions }
