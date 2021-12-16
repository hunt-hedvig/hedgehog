import React, { useState } from 'react'
import { FadeIn, Input, Label } from '@hedvig-ui'
import styled from '@emotion/styled'

const Wrapper = styled.form`
  width: 400px;
`

export const MemberSearchForm: React.FC = () => {
  const [, setFocused] = useState(false)
  const [personalNumber, setPersonalNumber] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Submit!')
  }

  return (
    <Wrapper onSubmit={handleSubmit}>
      {personalNumber ? (
        <FadeIn duration={200}>
          <Label>Personal number</Label>
        </FadeIn>
      ) : (
        <Label>{'\xa0'}</Label>
      )}
      <Input
        placeholder="Personal number"
        value={personalNumber}
        onBlur={() => setFocused(false)}
        onFocus={() => setFocused(true)}
        onChange={(e) => setPersonalNumber(e.currentTarget.value)}
      />
    </Wrapper>
  )
}
