import styled from '@emotion/styled'
import { Checkbox, Flex, Label } from '@hedvig-ui'
import { Radio } from '@hedvig-ui/Radio/radio'
import { numberMemberGroupsOptions } from 'features/questions/number-member-groups-radio-buttons'
import React from 'react'
import { FilterGroupState, LabelWithPopover } from './filters/ClaimListFilters'

export const Filters = styled(Flex)`
  width: fit-content;

  border-radius: 0.5rem;
  padding: 0.2rem 0.6rem;
`

export const FilterElementStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.7rem;

  & label {
    margin: 0;
  }
`

interface FilterElementProps {
  checked: (key: string) => boolean
  onChange: (key: string) => void
  label: string
  values: string[] | number[]
  popover?: string
  checkboxLabel?: typeof FilterGroupState
  onRender: (key: string) => React.ReactNode
}

export const FilterElement: React.FC<FilterElementProps> = ({
  checked,
  onChange,
  values,
  label,
  popover,
  checkboxLabel,
  onRender,
}) => {
  return (
    <FilterElementStyled>
      {popover ? (
        <LabelWithPopover label={label} popover={popover} />
      ) : (
        <Label>{label}</Label>
      )}

      {values.map((key) => (
        <Filters key={key} direction="row" align="center">
          <Checkbox
            label={!checkboxLabel ? key : checkboxLabel[key]}
            checked={checked(key)}
            onChange={() => onChange(key)}
          />
          {onRender(key)}
        </Filters>
      ))}
    </FilterElementStyled>
  )
}

export const FilterNumberMemberGroups = ({
  numberMemberGroups,
  setNumberMemberGroups,
}) => {
  return (
    <FilterElementStyled>
      <Label>Number of member groups</Label>
      {numberMemberGroupsOptions.map((option, index) => (
        <Filters key={index} direction="row" align="center">
          <Radio
            key={`${option.value}` + index}
            id={`${option.value}` + index}
            value={option.value}
            label={option.label}
            onChange={() => setNumberMemberGroups(option.value)}
            checked={option.value === numberMemberGroups || false}
          />
        </Filters>
      ))}
    </FilterElementStyled>
  )
}
