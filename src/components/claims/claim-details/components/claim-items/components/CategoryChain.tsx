import { Typography } from '@material-ui/core'
import { ItemCategoryKind } from 'api/generated/graphql'
import * as React from 'react'
import { SelectedItemCategory } from './CategorySelect'
import {
  CurrentChip,
  MultipleArrowsRight,
  PreviousChip,
  SmallArrowRight,
  UpcomingChip,
} from './styles'

const getTypeInfoSentence = (remainingTypes: string[]) => {
  if (remainingTypes.length === 0) {
    return <></>
  }

  if (remainingTypes.length === 1) {
    return (
      <>
        which will be able to append
        <span style={{ fontWeight: 500 }}>{' ' + remainingTypes[0]}s</span>.
      </>
    )
  }

  return (
    <>
      which will be able to append
      <span style={{ fontWeight: 500 }}>
        {' ' +
          remainingTypes
            .slice(0, -1)
            .map((type) => ` ${type}s`)
            .join(', ')}
      </span>
      {' and '}
      <span style={{ fontWeight: 500 }}>{remainingTypes.slice(-1) + 's.'}</span>
    </>
  )
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export const CategoryChain: React.FC<{
  suggestion: string
  selectedItemCategories: SelectedItemCategory[]
}> = ({ suggestion, selectedItemCategories }) => {
  const excludedTypes = ['family', 'company']
  const availableTypes = Object.keys(ItemCategoryKind).map((kind) =>
    kind.toLowerCase(),
  )
  const selectedTypes = selectedItemCategories.map(({ nextKind }) =>
    nextKind.toLowerCase(),
  )
  const remainingTypes = availableTypes
    .filter((type) => !selectedTypes.includes(type))
    .filter((type) => !excludedTypes.includes(type))

  const currentType = selectedTypes.splice(-1)
  const existsMoreTypes = remainingTypes.length > 0

  return (
    <>
      <Typography align={'center'} style={{ marginTop: '5px' }}>
        You are about to create the {currentType}{' '}
        <span style={{ fontWeight: 500 }}>{suggestion}</span>
        {!existsMoreTypes && '.'}
      </Typography>
      <Typography align={'center'} style={{ marginTop: '1px' }}>
        {existsMoreTypes && getTypeInfoSentence(remainingTypes)}
      </Typography>
      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        {selectedItemCategories?.map(({ id, displayName }) => {
          return (
            <React.Fragment key={id}>
              <PreviousChip variant="outlined" label={displayName} />
              <SmallArrowRight />
            </React.Fragment>
          )
        })}
        <CurrentChip variant="outlined" color="primary" label={suggestion} />
        {remainingTypes.map((type) => {
          return (
            <React.Fragment key={type}>
              <MultipleArrowsRight />
              <UpcomingChip variant="outlined" label={capitalize(type) + 's'} />
            </React.Fragment>
          )
        })}
      </div>
    </>
  )
}
