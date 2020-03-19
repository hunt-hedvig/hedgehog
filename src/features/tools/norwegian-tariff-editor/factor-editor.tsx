import { Card, CardsWrapper } from 'hedvig-ui/card'
import { TextArea } from 'hedvig-ui/text-area'
import { ThirdLevelHeadline } from 'hedvig-ui/typography'
import * as React from 'react'

interface FactorEditorProps {
  factorName: string
  onChange: (newFactorString: string) => void
}

export const FactorEditor: React.FunctionComponent<FactorEditorProps> = ({
  factorName,
  onChange,
}) => {
  const [factorString, setFactorString] = React.useState('')
  React.useEffect(() => onChange(factorString), [factorString])

  return (
    <>
      <ThirdLevelHeadline>{factorName}</ThirdLevelHeadline>
      <CardsWrapper>
        <Card>
          <TextArea
            placeholder={`Add factors of ${factorName} from excel (Including the name of the factor, its keys on the left and the columns: 'Fire', 'Leakage', 'Other', 'All risk' and 'Travel' OBS: Do not include 'Special object')...`}
            text={factorString}
            setText={setFactorString}
          />
        </Card>
      </CardsWrapper>
    </>
  )
}
