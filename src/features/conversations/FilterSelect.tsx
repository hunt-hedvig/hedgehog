import styled from '@emotion/styled'
import {
  Button,
  ButtonsGroup,
  FadeIn,
  Flex,
  MainHeadline,
  Paragraph,
} from '@hedvig-ui'
import { FilterState, getFilterColor } from 'features/questions/filter'
import React, { useEffect, useState } from 'react'
import { Shield, ShieldShaded } from 'react-bootstrap-icons'
import { range } from 'utils/array'
import { Keys, useKeyIsPressed } from 'utils/hooks/key-press-hook'
import { useNumberMemberGroups } from 'utils/number-member-groups-context'

const FilterButton = styled.div<{ selected: boolean }>`
  display: inline-flex;
  background-color: ${({ theme, selected }) =>
    selected ? theme.accent : theme.backgroundTransparent};
  padding: 0.3em 0.6em;
  border-radius: 6px;
  transition: all 200ms;
  cursor: pointer;
  align-items: center;
  color: ${({ theme, selected }) =>
    selected ? theme.accentContrast : theme.semiStrongForeground};

  :hover {
    background-color: ${({ theme, selected }) =>
      selected ? theme.accent : theme.accentLight};
    color: ${({ theme, selected }) =>
      selected ? theme.accentLight : theme.accent};
  }
`

const GroupIcon = styled.div<{ filter: FilterState }>`
  width: 1em;
  height: 1em;
  background-color: ${({ filter }) => getFilterColor(filter)};
  border-radius: 3px;
`

export const FilterSelect: React.FC<{
  filters: ReadonlyArray<FilterState>
  onToggle: (filter: FilterState) => void
  onSubmit: () => void
}> = ({ filters, onToggle, onSubmit }) => {
  const [delayButtonAnimation, setDelayButtonAnimation] = useState(false)
  const { numberMemberGroups } = useNumberMemberGroups()
  const buttonAnimationDelay = 700 + 70 * (numberMemberGroups + 7)

  const isEnterPressed = useKeyIsPressed(Keys.Enter)

  useEffect(() => {
    if (!!filters.length && isEnterPressed) {
      onSubmit()
    }
  }, [isEnterPressed])

  useEffect(() => {
    if (!!filters.length) {
      setDelayButtonAnimation(true)
      setInterval(
        () => setDelayButtonAnimation(false),
        buttonAnimationDelay + 700,
      )
    }
  }, [])

  return (
    <Flex direction={'row'} justify={'space-between'}>
      <Flex style={{ width: '30%' }}></Flex>
      <Flex style={{ width: '40%', paddingTop: '15vh' }} direction={'column'}>
        <Flex
          direction="column"
          align="center"
          fullWidth
          style={{ marginBottom: '4.0em', textAlign: 'center' }}
        >
          <FadeIn delay={'300ms'}>
            <MainHeadline>Let's get you setup</MainHeadline>
          </FadeIn>
          <FadeIn delay={'700ms'}>
            <Paragraph
              secondary
              style={{ fontSize: '0.95em', marginTop: '0.3em' }}
            >
              What kind of conversations do you want?
            </Paragraph>
          </FadeIn>
        </Flex>
        <ButtonsGroup style={{ justifyContent: 'center' }}>
          {range(numberMemberGroups).map((memberGroup) => {
            return (
              <FadeIn delay={`${700 + 70 * memberGroup}ms`} key={memberGroup}>
                <FilterButton
                  onClick={() => onToggle(memberGroup)}
                  selected={filters.includes(memberGroup)}
                >
                  {FilterState[memberGroup]} group{' '}
                  <GroupIcon
                    filter={memberGroup as FilterState}
                    style={{ marginLeft: '0.5em' }}
                  />
                </FilterButton>
              </FadeIn>
            )
          })}
        </ButtonsGroup>
        <ButtonsGroup style={{ justifyContent: 'center', marginTop: '1.0em' }}>
          <FadeIn delay={`${700 + 70 * (numberMemberGroups + 1)}ms`}>
            <FilterButton
              selected={filters.includes(FilterState.Sweden)}
              onClick={() => onToggle(FilterState.Sweden)}
            >
              Sweden <span style={{ marginLeft: '0.5em' }}>🇸🇪</span>
            </FilterButton>
          </FadeIn>
          <FadeIn delay={`${700 + 70 * (numberMemberGroups + 2)}ms`}>
            <FilterButton
              selected={filters.includes(FilterState.Norway)}
              onClick={() => onToggle(FilterState.Norway)}
            >
              Norway <span style={{ marginLeft: '0.5em' }}>🇳🇴</span>
            </FilterButton>
          </FadeIn>
          <FadeIn delay={`${700 + 70 * (numberMemberGroups + 3)}ms`}>
            <FilterButton
              selected={filters.includes(FilterState.Denmark)}
              onClick={() => onToggle(FilterState.Denmark)}
            >
              Denmark <span style={{ marginLeft: '0.5em' }}>🇩🇰</span>
            </FilterButton>
          </FadeIn>
        </ButtonsGroup>
        <ButtonsGroup style={{ justifyContent: 'center', marginTop: '1.0em' }}>
          <FadeIn delay={`${700 + 70 * (numberMemberGroups + 4)}ms`}>
            <FilterButton
              selected={filters.includes(FilterState.HasOpenClaim)}
              onClick={() => onToggle(FilterState.HasOpenClaim)}
            >
              Open claims <ShieldShaded style={{ marginLeft: '0.5rem' }} />
            </FilterButton>
          </FadeIn>
          <FadeIn delay={`${700 + 70 * (numberMemberGroups + 5)}ms`}>
            <FilterButton
              selected={filters.includes(FilterState.NoOpenClaim)}
              onClick={() => onToggle(FilterState.NoOpenClaim)}
            >
              No claims <Shield style={{ marginLeft: '0.5rem' }} />
            </FilterButton>
          </FadeIn>
        </ButtonsGroup>
        {!!filters.length && (
          <FadeIn
            delay={`${delayButtonAnimation ? buttonAnimationDelay : 200}ms`}
            style={{ width: '100%' }}
          >
            <Flex
              direction="column"
              justify={'center'}
              style={{ marginTop: '4.0em' }}
              fullWidth
              align={'center'}
            >
              <Button
                onClick={() => onSubmit()}
                variation={'primary'}
                halfWidth
                style={{ marginBottom: '0.5em' }}
              >
                Continue
              </Button>
              <span
                style={{
                  fontSize: '0.80em',
                  color: '#aaaaaa',
                }}
              >
                Don't worry, you can change these later
              </span>
            </Flex>
          </FadeIn>
        )}
      </Flex>
      <Flex style={{ width: '30%' }}></Flex>
    </Flex>
  )
}
