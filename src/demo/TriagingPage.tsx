import React, { useState } from 'react'
import SwipeableViews from 'react-swipeable-views'
import { TriagingSearchPage } from 'demo/views/TriagingSearchPage'
import { TriagingStartPage } from 'demo/views/TriagingStartPage'
import { TriagingFormPage } from 'demo/views/TriagingFormPage'
import styled from '@emotion/styled'
import { ArrowLeft, InfoCircle } from 'react-bootstrap-icons'
import { Flex, Spinner, StandaloneMessage } from '@hedvig-ui'
import chroma from 'chroma-js'
import { useAuthenticate } from 'auth/use-authenticate'

export const Container = styled.div`
  display: flex;

  flex-direction: column;
  flex: 1;

  padding: 1rem 0;
`

const TopMenuContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 0.5rem 2rem 0.75rem 2rem;
`

const BackButton = styled(ArrowLeft)`
  width: 1.75rem;
  height: 1.75rem;

  padding-bottom: 0.25rem;

  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
`

const InfoButton = styled(InfoCircle)`
  width: 1.5rem;
  height: 1.5rem;

  padding-bottom: 0.25rem;

  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
`

const StepLine = styled.div<{ active: boolean }>`
  width: 1.25rem;
  height: 0.2rem;

  background-color: ${({ theme, active }) =>
    active
      ? theme.foreground
      : chroma(theme.semiStrongForeground).brighten(2.5).hex()};

  margin: -0.5rem 0.25rem 0 0.25rem;
`

interface ViewSetting {
  back: boolean
  info: boolean
  step: boolean
}

export const TriagingPage: React.FC = () => {
  const { portal, error } = useAuthenticate()
  const [slide, setSlide] = useState(0)
  const [option, setOption] = useState<null | string>(null)

  const goBack = () => {
    setSlide((prevSlide) => Math.max(0, prevSlide - 1))
  }

  const settings = [
    { back: false, info: false, step: false },
    { back: true, info: true, step: true },
    { back: true, info: true, step: true },
  ] as ViewSetting[]

  if (error) {
    window.location.pathname = '/login/logout'

    return null
  }

  if (!portal) {
    return (
      <StandaloneMessage paddingTop="45vh" opacity={1}>
        <Spinner />
      </StandaloneMessage>
    )
  }

  return (
    <Container>
      <TopMenuContainer>
        <div
          style={{ visibility: settings[slide].back ? 'visible' : 'hidden' }}
        >
          <BackButton onClick={goBack} />
        </div>
        <div
          style={{ visibility: settings[slide].step ? 'visible' : 'hidden' }}
        >
          <Flex align="center" justify="center">
            <StepLine active={slide > 0} />
            <StepLine active={slide > 1} />
            <StepLine active={false} />
          </Flex>
        </div>
        <div
          style={{ visibility: settings[slide].info ? 'visible' : 'hidden' }}
        >
          <InfoButton onClick={() => window.alert('Not much going on here')} />
        </div>
      </TopMenuContainer>
      <SwipeableViews
        disabled={!option}
        index={slide}
        onChangeIndex={(nextIndex) => setSlide(nextIndex)}
        onTransitionEnd={() => {
          if (slide !== 2) setOption(null)
        }}
      >
        <TriagingStartPage onStartClaim={() => setSlide(1)} />
        <TriagingSearchPage
          onSelect={(newOption) => {
            setOption(newOption)
            setSlide(2)
          }}
        />
        <TriagingFormPage option={option ?? ''} />
      </SwipeableViews>
    </Container>
  )
}
