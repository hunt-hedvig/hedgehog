import styled from '@emotion/styled'
import { ButtonsGroup, FadeIn, Flex, MainHeadline, Paragraph } from '@hedvig-ui'
import React from 'react'
import { ShieldShaded } from 'react-bootstrap-icons'

const FilterButton = styled.div`
  display: inline-flex;
  background-color: ${({ theme }) => theme.backgroundTransparent};
  padding: 0.3em 0.6em;
  border-radius: 6px;
  transition: all 200ms;
  cursor: pointer;
  align-items: center;
  color: ${({ theme }) => theme.semiStrongForeground};

  :hover {
    background-color: ${({ theme }) => theme.accentLight};
    color: ${({ theme }) => theme.accent};
  }
`

const GroupIcon = styled.div`
  width: 1em;
  height: 1em;
  background-color: ${({ theme }) => theme.danger};
  border-radius: 3px;
`

export const FilterSelect: React.FC = () => {
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
          <FadeIn delay={`${700 + 70 * 1}ms`}>
            <FilterButton>
              First group <GroupIcon style={{ marginLeft: '0.5em' }} />
            </FilterButton>
          </FadeIn>
          <FadeIn delay={`${700 + 70 * 2}ms`}>
            <FilterButton>
              Second group <GroupIcon style={{ marginLeft: '0.5em' }} />
            </FilterButton>
          </FadeIn>
          <FadeIn delay={`${700 + 70 * 3}ms`}>
            <FilterButton>
              Third group <GroupIcon style={{ marginLeft: '0.5em' }} />
            </FilterButton>
          </FadeIn>
        </ButtonsGroup>
        <ButtonsGroup style={{ justifyContent: 'center', marginTop: '1.0em' }}>
          <FadeIn delay={`${700 + 70 * 4}ms`}>
            <FilterButton>
              Sweden <span style={{ marginLeft: '0.5em' }}>🇸🇪</span>
            </FilterButton>
          </FadeIn>
          <FadeIn delay={`${700 + 70 * 5}ms`}>
            <FilterButton>
              Norway <span style={{ marginLeft: '0.5em' }}>🇳🇴</span>
            </FilterButton>
          </FadeIn>
          <FadeIn delay={`${700 + 70 * 6}ms`}>
            <FilterButton>
              Denmark <span style={{ marginLeft: '0.5em' }}>🇩🇰</span>
            </FilterButton>
          </FadeIn>
        </ButtonsGroup>
        <ButtonsGroup style={{ justifyContent: 'center', marginTop: '1.0em' }}>
          <FadeIn delay={`${700 + 70 * 7}ms`}>
            <FilterButton>
              Claim open <ShieldShaded style={{ marginLeft: '0.5rem' }} />
            </FilterButton>
          </FadeIn>
          <FadeIn delay={`${700 + 70 * 8}ms`}>
            <FilterButton>No claim</FilterButton>
          </FadeIn>
        </ButtonsGroup>
        {/*<Flex fullWidth justify={'center'}>
          <FadeIn>
            <Paragraph
              secondary
              style={{
                fontSize: '0.80em',
                marginTop: '4.0em',
                color: '#aaaaaa',
              }}
            >
              Don't worry, you can change these later
            </Paragraph>
          </FadeIn>
        </Flex>*/}
      </Flex>
      <Flex style={{ width: '30%' }}></Flex>
    </Flex>
  )
}
