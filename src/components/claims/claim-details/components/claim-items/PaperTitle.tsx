import styled from '@emotion/styled'
import { InfoTag, InfoTagStatus } from '@hedvig-ui'
import { ThirdLevelHeadline } from 'hedvig-ui/typography'
import React from 'react'

export interface PaperTitleBadgeProps {
  icon?: React.ElementType
  status: InfoTagStatus
  label: string
}

const PaperTitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1em;
`

export const PaperTitle: React.FC<{
  title: string
  badge?: PaperTitleBadgeProps | null
}> = ({ title, badge }) => {
  const BadgeIcon = badge?.icon

  return (
    <PaperTitleWrapper>
      <div>
        <ThirdLevelHeadline>{title}</ThirdLevelHeadline>
      </div>
      {badge && (
        <InfoTag
          style={{
            fontWeight: 'bold',
            padding: '0.2em 0.7em',
            fontSize: '0.85em',
          }}
          status={badge.status}
        >
          {BadgeIcon && (
            <BadgeIcon
              style={{
                paddingTop: '0.2em',
                marginRight: '0.5em',
              }}
            />
          )}
          {badge.label}
        </InfoTag>
      )}
    </PaperTitleWrapper>
  )
}
