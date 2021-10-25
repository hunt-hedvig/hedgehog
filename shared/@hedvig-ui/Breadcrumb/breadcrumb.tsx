import styled from '@emotion/styled'
import React from 'react'

const BreadcrumbWrapper = styled.div`
  &,
  & * {
    font-size: 14px;
    color: ${({ theme }) => theme.mutedText};
  }
`

interface BreadcrumbProps extends React.HTMLAttributes<HTMLDivElement> {
  sections: Array<{
    key: string | number
    content: React.ReactNode
    active?: boolean
  }>
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  sections,
  ...props
}) => (
  <BreadcrumbWrapper {...props}>
    {sections.map((section, index) => (
      <>
        {section.content}
        {index !== sections.length - 1 ? ' / ' : null}
      </>
    ))}
  </BreadcrumbWrapper>
)
