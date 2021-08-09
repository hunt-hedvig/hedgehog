import {
  NorwegianGripenFactorInput,
  NorwegianGripenFactorType,
  useCreateNorwegianGripenPriceEngineMutation,
} from 'api/generated/graphql'
import { FactorEditor } from 'features/tools/norwegian-tariff-editor/factor-editor'
import { PostalCodesEditor } from 'features/tools/norwegian-tariff-editor/postal-codes-editor'
import { Button } from 'hedvig-ui/button'
import { Card, CardsWrapper } from 'hedvig-ui/card'
import { Spacing } from 'hedvig-ui/spacing'
import { TextArea } from 'hedvig-ui/text-area'
import { MainHeadline, ThirdLevelHeadline } from 'hedvig-ui/typography'
import React from 'react'
import {
  Notification,
  WithShowNotification,
} from 'store/actions/notificationsActions'
import { withShowNotification } from 'utils/notifications'

const initialFactorState: NorwegianGripenFactorInput[] = Object.keys(
  NorwegianGripenFactorType,
).map((key) => {
  return {
    factorType: NorwegianGripenFactorType[key],
    factorString: '',
  }
})

const NorwegianTariffEditorComponent: React.FC<WithShowNotification> = ({
  showNotification,
}) => {
  const [baseFactors, setBaseFactors] = React.useState<string>('')
  const [factors, setFactors] = React.useState<NorwegianGripenFactorInput[]>(
    initialFactorState,
  )
  const [
    useCreateNorwegianGripenPriceEngine,
    { loading },
  ] = useCreateNorwegianGripenPriceEngineMutation()
  return (
    <>
      <MainHeadline>Create Norwegian Price Engine "Gripen"</MainHeadline>
      <ThirdLevelHeadline>Base factors</ThirdLevelHeadline>
      <CardsWrapper>
        <Card>
          <TextArea
            placeholder={
              'Add Base Factors from excel including "Product" (Columns: Fire, Leakage, Other, All risk and Travel), include "Base factor" and "Index per year"...'
            }
            value={baseFactors}
            onChange={setBaseFactors}
          />
        </Card>
      </CardsWrapper>
      {factors.map((factor) => (
        <FactorEditor
          key={factor.factorType}
          factorName={
            factor.factorType[0] +
            factor.factorType
              .replace(/_/g, ' ')
              .toLowerCase()
              .slice(1)
          }
          onChange={getSetFactorStringFunction(
            factor.factorType,
            factors,
            setFactors,
          )}
        />
      ))}
      <Spacing top>
        <Button
          fullWidth
          variation={'primary'}
          disabled={loading}
          onClick={() => {
            if (
              !window.confirm(
                'Are you sure you want to create the price engine?',
              )
            ) {
              return
            }
            useCreateNorwegianGripenPriceEngine({
              variables: {
                request: {
                  baseFactorString: baseFactors,
                  factors,
                },
              },
            })
              .then(() => {
                showNotification({
                  type: 'olive',
                  header: 'Success',
                  message: 'Successfully created price engine',
                })
              })
              .catch((error) => {
                showNotification({
                  type: 'red',
                  header: 'Error',
                  message: error.message,
                })
                throw error
              })
          }}
        >
          Create Norwegian Gripen Price Engine
        </Button>
        <PostalCodesEditor
          showNotification={(data: Notification) => showNotification(data)}
        />
      </Spacing>
    </>
  )
}

const getSetFactorStringFunction = (
  factorType: NorwegianGripenFactorType,
  factors: NorwegianGripenFactorInput[],
  setFactors: (factors: NorwegianGripenFactorInput[]) => void,
): ((newFactorString: string) => void) => {
  return (factorString: string) => {
    setFactors(
      factors.map((factor) => {
        if (factor.factorType === factorType) {
          return {
            factorType,
            factorString,
          }
        } else {
          return factor
        }
      }),
    )
  }
}

export const NorwegianTariffCreator = withShowNotification(
  NorwegianTariffEditorComponent,
)
