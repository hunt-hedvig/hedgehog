import { Card, CardsWrapper } from 'hedvig-ui/card'
import { TextArea } from 'hedvig-ui/text-area'
import { Paragraph, SecondLevelHeadline } from 'hedvig-ui/typography'
import * as React from 'react'

interface FactorEditorProps {
  factorName: string
  factorString: string
  setFactorString: (newFactorString: string) => void
}

export const FactorEditor: React.FunctionComponent<FactorEditorProps> = ({
  factorName,
  factorString,
  setFactorString,
}) => {
  return (
    <>
      <SecondLevelHeadline>{factorName}</SecondLevelHeadline>
      <CardsWrapper>
        <Card span={2}>
          <TextArea
            placeholder={`Add factors of ${factorName} from excel...`}
            setText={setFactorString}
          />
        </Card>
        <Card span={2}>
          <Paragraph>{factorString}</Paragraph>
        </Card>
      </CardsWrapper>
    </>
  )
}
