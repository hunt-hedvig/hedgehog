import styled from '@emotion/styled'
import { Checkbox, Flex, Label } from '@hedvig-ui'
import { useArrowKeyboardNavigation } from '@hedvig-ui/hooks/keyboard/use-arrow-keyboard-navigation'
import { Radio } from '@hedvig-ui/Radio/radio'
import { numberMemberGroupsOptions } from 'features/questions/number-member-groups-radio-buttons'
import React, { useEffect } from 'react'
import { FilterGroupState, LabelWithPopover } from './filters/ClaimListFilters'

export const Filters = styled(Flex)<{ active: boolean }>`
  width: fit-content;
  border: ${({ active, theme }) =>
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
  values: string[] | number[]
  popover?: string
  checkboxLabel?: typeof FilterGroupState
  onRender: (key: string) => React.ReactNode
  maxStep: number
  onNavigationStep?: (step: number) => void
}

export const FilterElement: React.FC<FilterElementProps> = ({
  active,
  onPerfom,
  checked,
  onChange,
  values,
  label,
  popover,
  checkboxLabel,
  onRender,
  maxStep,
  onNavigationStep,
}) => {
  const [navigationStep, reset] = useArrowKeyboardNavigation({
    maxStep,
    onPerformNavigation: (index) => {
      onPerfom(index)
    },
    onNavigationStep: () => {
      if (onNavigationStep) {
        onNavigationStep(navigationStep)
      }
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
          active={active && navigationStep === index - 1}
        >
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
      {numberMemberGroupsOptions.map((option, index) => (
        <Filters
          key={index}
          direction="row"
          align="center"
          active={active && navigationStep === index - 1}
        >
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
