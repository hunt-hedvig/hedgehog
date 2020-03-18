import { Card, CardsWrapper } from 'hedvig-ui/card'
import { TextArea } from 'hedvig-ui/text-area'
import { SecondLevelHeadline } from 'hedvig-ui/typography'
import * as React from 'react'

interface FactorEditorProps {
  factorName: string
  setFactorString: (newFactorString: string) => void
}

export const FactorEditor: React.FunctionComponent<FactorEditorProps> = ({
  factorName,
  setFactorString,
}) => {
  return (
    <>
      <SecondLevelHeadline>{factorName}</SecondLevelHeadline>
      <CardsWrapper>
        <Card>
          <TextArea
            placeholder={`Add factors of ${factorName} from excel (Including the name of the factor, its keys on the left and the columns: 'Fire', 'Leakage', 'Other', 'All risk' and 'Travel' OBS: Do not include 'Special object')...`}
            setText={setFactorString}
          />
        </Card>
      </CardsWrapper>
    </>
  )
}
