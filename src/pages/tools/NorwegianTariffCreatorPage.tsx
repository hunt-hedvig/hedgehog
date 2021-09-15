import {
  Button,
  Card,
  CardsWrapper,
  MainHeadline,
  Spacing,
  TextArea,
  ThirdLevelHeadline,
} from '@hedvig-ui'
import { FactorEditor } from 'features/tools/norwegian-tariff-editor/factor-editor'
import { PostalCodesEditor } from 'features/tools/norwegian-tariff-editor/postal-codes-editor'
import React from 'react'
import { toast } from 'react-hot-toast'
import {
  NorwegianGripenFactorInput,
  NorwegianGripenFactorType,
  useCreateNorwegianGripenPriceEngineMutation,
} from 'types/generated/graphql'
import { useConfirmDialog } from 'utils/hooks/modal-hook'

const initialFactorState: NorwegianGripenFactorInput[] = Object.keys(
  NorwegianGripenFactorType,
).map((key) => {
  return {
    factorType: NorwegianGripenFactorType[key],
    factorString: '',
  }
})

export const NorwegianTariffCreatorPage: React.FC = () => {
  const [baseFactors, setBaseFactors] = React.useState<string>('')
  const [factors, setFactors] = React.useState<NorwegianGripenFactorInput[]>(
    initialFactorState,
  )
  const [
    useCreateNorwegianGripenPriceEngine,
    { loading },
  ] = useCreateNorwegianGripenPriceEngineMutation()

  const { confirm } = useConfirmDialog()

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
          variation="primary"
          disabled={loading}
          onClick={() => {
            confirm('Are you sure you want to create the price engine?').then(
              () => {
                toast.promise(
                  useCreateNorwegianGripenPriceEngine({
                    variables: {
                      request: {
                        baseFactorString: baseFactors,
                        factors,
                      },
                    },
                  }),
                  {
                    loading: 'Creating price engine',
                    success: 'Price engine created',
                    error: 'Could not create price engine',
                  },
                )
              },
            )
          }}
        >
          Create Norwegian Gripen Price Engine
        </Button>
        <PostalCodesEditor />
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
