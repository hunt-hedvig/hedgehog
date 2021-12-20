import React, { useEffect, useRef, useState } from 'react'
import { FadeIn, Input, Label, Spacing } from '@hedvig-ui'
import styled from '@emotion/styled'
import { useSosMemberLookupLazyQuery } from 'types/generated/graphql'
import {
  Logo,
  LogoIcon,
} from 'portals/hope/features/navigation/sidebar/elements'
import { colorsV3 } from '@hedviginsurance/brand'
import { MemberCard } from 'portals/sos/features/member-search/components/MemberCard'
import { InsuranceCard } from 'portals/sos/features/member-search/components/InsuranceCard'

const Wrapper = styled.form`
  width: 25rem;
`

const HopeLogo = styled(Logo)`
  width: 10rem;
  fill: ${colorsV3.gray800};
`

const HopeLogoIcon = styled(LogoIcon)`
  width: 1.4rem;
  fill: ${colorsV3.gray800};
  margin-bottom: 2rem;
`

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;

  margin-bottom: 2rem;
  margin-right: -0.7rem;
`

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
`

const Container = styled.div<{ pushTop: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;

  transition: padding-top 300ms ease-in-out;
  padding-top: ${({ pushTop }) => (pushTop ? '5vh' : '30vh')};
`

const ErrorInformation = styled.div`
  text-align: center;
  margin-top: 0.35rem;
  color: ${({ theme }) => theme.danger};
  font-size: 0.85rem;
`

const ResultWrapper = styled.div<{ show: boolean }>`
  transition: opacity 300ms ease-in-out;
  opacity: ${({ show }) => (show ? 1 : 0)};
`

export const MemberSearchForm: React.FC = () => {
  const [memberLookup, { loading, data }] = useSosMemberLookupLazyQuery()
  const [ssn, setSsn] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [error, setError] = useState('')

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setError('')
    if (ssn === '') {
      setShowResult(false)
    }
  }, [ssn])

  const valid = () => {
    if (ssn === '') {
      setError('SSN cannot be empty')
      return false
    }

    if (!/^[0-9]*$/.test(ssn)) {
      setError('SSN can only be numbers')
      return false
    }

    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!valid()) {
      return
    }

    memberLookup({ variables: { ssn } }).then((response) => {
      if (response.error) {
        setError('No member found for SSN')
        return
      }
      setShowResult(true)
      inputRef?.current?.blur()
    })
  }

  const member = data?.SOSMemberLookup

  return (
    <Container pushTop={showResult}>
      <LogoContainer>
        <HopeLogo />
        <HopeLogoIcon />
      </LogoContainer>
      <FormContainer>
        <Wrapper onSubmit={handleSubmit}>
          {ssn ? (
            <FadeIn duration={200}>
              <Label>Personal number</Label>
            </FadeIn>
          ) : (
            <Label>{'\xa0'}</Label>
          )}
          <Input
            ref={inputRef}
            autoFocus
            placeholder="Personal number"
            size="large"
            disabled={loading}
            value={ssn}
            onFocus={() => {
              if (showResult) {
                setShowResult(false)
              }
            }}
            onChange={(e) => setSsn(e.currentTarget.value)}
          />
          {error && (
            <FadeIn duration={200}>
              <ErrorInformation>{error}</ErrorInformation>
            </FadeIn>
          )}
        </Wrapper>
      </FormContainer>
      <Spacing top="medium" />
      <ResultWrapper show={showResult}>
        <MemberCard
          fullName={`${member?.firstName ?? ''} ${member?.lastName ?? ''}`}
          memberId={member?.memberId ?? ''}
          email={member?.email ?? ''}
          phoneNumber={member?.phoneNumber ?? ''}
        />
        <Spacing top="small" />
        <InsuranceCard />
        <Spacing top="small" />
        <InsuranceCard />
      </ResultWrapper>
    </Container>
  )
}
