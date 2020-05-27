import {
  FourthLevelHeadline,
  MainHeadline,
  Paragraph,
  SecondLevelHeadline,
  ThirdLevelHeadline,
} from 'hedvig-ui/typography'
import React from 'react'

export default {
  title: 'Typography',
}

export const Headlines: React.FC = () => (
  <>
    <MainHeadline>Main headline</MainHeadline>
    <SecondLevelHeadline>Second level headline</SecondLevelHeadline>
    <ThirdLevelHeadline>Third level headline</ThirdLevelHeadline>
    <FourthLevelHeadline>Fourth level headline</FourthLevelHeadline>
    <Paragraph>Paragraph</Paragraph>
  </>
)
