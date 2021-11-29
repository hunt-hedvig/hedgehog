import styled from '@emotion/styled'
import { Checkbox, Flex, Label } from '@hedvig-ui'
import { useArrowKeyboardNavigation } from '@hedvig-ui/hooks/keyboard/use-arrow-keyboard-navigation'
import { Radio } from '@hedvig-ui/Radio/radio'
import { numberMemberGroupsOptions } from 'features/questions/number-member-groups-radio-buttons'
import React, { useEffect } from 'react'
import { LabelWithPopover } from './filters/ClaimListFilters'

export const Filters = styled(Flex)<{ active: boolean }>`
  border-bottom: ${({ active, theme }) =>
    active ? `2px solid ${theme.accentLight}` : 'none'};
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
  active: boolean
  checked: (key: string) => boolean
  onChange: (key: string) => void
  onPerfom: (index: number) => void
  label: string
  values: any
  popover?: string
  CheckboxLabel?: any
  getContent: (key: string) => React.ReactNode
  maxStep: number
}

export const FilterElement: React.FC<FilterElementProps> = ({
  active,
  onPerfom,
  checked,
  onChange,
  values,
  label,
  popover,
  CheckboxLabel,
  getContent,
  maxStep,
}) => {
  const [navigationStep, reset] = useArrowKeyboardNavigation({
    maxStep,
    onPerformNavigation: (index) => {
      onPerfom(index)
    },
    isActive: active,
    withNegative: true,
  })

  useEffect(() => {
    if (!active) {
      reset()
    }
  }, [active])

  return (
    <FilterElementStyled>
      {popover ? (
        <LabelWithPopover label={label} popover={popover} />
      ) : (
        <Label>{label}</Label>
      )}

      {values.map((key, index) => (
        <Filters
          key={key}
          direction="row"
          align="center"
          active={active && navigationStep + 1 === index}
        >
          <Checkbox
            label={!CheckboxLabel ? key : CheckboxLabel[key]}
            checked={checked(key)}
            onChange={() => onChange(key)}
          />
          {getContent(key)}
        </Filters>
      ))}
    </FilterElementStyled>
  )
}

export const FilterNumberMemberGroups = ({
  active,
  numberMemberGroups,
  setNumberMemberGroups,
}) => {
  const [navigationStep, reset] = useArrowKeyboardNavigation({
    maxStep: 0,
    onPerformNavigation: (index) => {
      setNumberMemberGroups(index + 3)
    },
    isActive: active,
    withNegative: true,
  })

  useEffect(() => {
    if (!active) {
      reset()
    }
  }, [active])

  return (
    <FilterElementStyled>
      <Label>Number of member groups</Label>
      {numberMemberGroupsOptions.map((option, idx) => (
        <Filters
          key={idx}
          direction="row"
          align="center"
          active={active && navigationStep + 1 === idx}
        >
          <Radio
            key={`${option.value}` + idx}
            id={`${option.value}` + idx}
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
