import React, { useState } from 'react'
import { Button, FadeIn, Flex, Input, Label, Spacing } from '@hedvig-ui'
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
        size="large"
        value={personalNumber}
        onBlur={() => setFocused(false)}
        onFocus={() => setFocused(true)}
        onChange={(e) => setPersonalNumber(e.currentTarget.value)}
      />
      <Spacing top="medium" />
      <Flex direction="row" justify="center">
        <Button
          style={{ width: '8rem', marginRight: '0.5rem' }}
          size="medium"
          type="submit"
        >
          Search
        </Button>
        <Button
          variant="secondary"
          style={{ marginLeft: '0.5rem', width: '8rem' }}
          size="medium"
          type="submit"
        >
          Help
        </Button>
      </Flex>
    </Wrapper>
  )
}
