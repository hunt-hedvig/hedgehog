import { css, Theme } from '@emotion/react'
import styled from '@emotion/styled'
import { useArrowKeyboardNavigation } from '@hedvig-ui/hooks/keyboard/use-arrow-keyboard-navigation'
import { isPressing, Keys } from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { CreateFilterModal } from 'features/claims/claim-templates/CreateFilterModal'
import { FilteredMetric } from 'features/claims/claim-templates/FilteredMetric'
import { useTemplateClaims } from 'features/claims/claim-templates/hooks/use-template-claims'
import { useMe } from 'features/user/hooks/use-me'
import React, { useEffect, useState } from 'react'
import { Plus } from 'react-bootstrap-icons'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import { UserSettingKey } from 'types/generated/graphql'
import { FocusItems } from '../navigation/hooks/use-navigation'

const MetricsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`

export const metricStyles = (theme: Theme, active: boolean = false) => css`
  display: flex;
  flex-direction: column;
  color: ${theme.accentContrast} !important;
  background: ${theme.accent};
  padding: ${active ? '1rem' : '1.5rem'};
  border-radius: 0.5rem;
  margin-right: 1rem;
  margin-bottom: 1rem;
  min-width: 200px;
  border: ${active ? '0.5rem solid red' : 'none'};

  &:hover,
  &:focus {
    opacity: 0.8;
    color: ${theme.accentContrast}!important;
  }
`

const Metric = styled(Link)<{ active: boolean }>`
  ${({ theme, active }) => metricStyles(theme, active)}
`

const AddMetricCard = styled.div<{ active: boolean }>`
  min-height: 111.5px;
  width: 200px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;

  outline: none;
  border-radius: 0.5rem;
  margin-right: 1rem;
  margin-bottom: 1rem;
  padding: 15px 0;

  border: 2px dotted ${({ active, theme }) => (!active ? theme.border : 'red')};

  & svg {
    width: 2em;
    height: 2em;
    color: ${({ theme }) => theme.border};
    margin-bottom: 0.5rem;
    transition: none;
  }

  & span {
    font-size: 14px;
    color: ${({ theme }) => theme.accentLight};
  }

  &:hover,
  &:focus {
    cursor: pointer;
    border-color: ${({ theme }) => theme.accent};

    & svg,
    & span {
      color: ${({ theme }) => theme.accent};
    }
  }
`

export const MetricNumber = styled.span`
  display: block;
  font-size: 2rem;
  padding-bottom: 0.25rem;
`
export const MetricName = styled.span`
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0.66;
`

export const MetricList = ({
  dashboardNumbers,
  navigationAvailable,
  setFocus,
}) => {
  const [createFilter, setCreateFilter] = useState(false)
  const { settings } = useMe()
  const history = useHistory()

  const {
    templateFilters,
    createTemplate,
    editTemplateWithName,
    removeTemplate,
  } = useTemplateClaims()

  const [navigationStep, reset] = useArrowKeyboardNavigation({
    maxStep: templateFilters.length + 1,
    isActive: navigationAvailable,
    onPerformNavigation: (index) => {
      const itemIndex = index + 1

      if (itemIndex === templateFilters.length + 2) {
        setCreateFilter(true)
        return
      }

      if (itemIndex === 0) {
        history.push('/claims/list/1')
        return
      }

      if (itemIndex === 1) {
        const isConversationsAvailable =
          settings[UserSettingKey.FeatureFlags] &&
          settings[UserSettingKey.FeatureFlags].conversations

        history.push(isConversationsAvailable ? '/conversations' : '/questions')
        return
      }

      setFocus(FocusItems.Claims.name)
      history.push(
        `/claims/list/1?template=${templateFilters[itemIndex - 2].id}`,
      )
    },
    vertical: false,
    withNegative: true,
  })

  useEffect(() => {
    if (!navigationAvailable) {
      reset()
    }
  }, [navigationAvailable])

  return (
    <>
      <MetricsWrapper>
        <Metric
          to="/claims/list/1"
          active={navigationAvailable && navigationStep + 1 === 0}
        >
          <MetricNumber>{dashboardNumbers?.numberOfClaims || 0}</MetricNumber>
          <MetricName>claims</MetricName>
        </Metric>
        {settings[UserSettingKey.FeatureFlags] &&
        settings[UserSettingKey.FeatureFlags].conversations ? (
          <Metric
            to="/conversations"
            active={navigationAvailable && navigationStep + 1 === 1}
          >
            <MetricNumber>
              {dashboardNumbers?.numberOfQuestions || 0}
            </MetricNumber>
            <MetricName>conversations</MetricName>
          </Metric>
        ) : (
          <Metric
            to="/questions"
            active={navigationAvailable && navigationStep + 1 === 1}
          >
            <MetricNumber>
              {dashboardNumbers?.numberOfQuestions || 0}
            </MetricNumber>
            <MetricName>questions</MetricName>
          </Metric>
        )}

        {templateFilters.map((template, index) => (
          <FilteredMetric
            active={navigationAvailable && navigationStep + 1 === index + 2}
            onCreate={createTemplate}
            onRemove={removeTemplate}
            onEdit={editTemplateWithName}
            key={template.id}
            template={template}
          />
        ))}

        <AddMetricCard
          active={
            navigationAvailable &&
            navigationStep + 1 === templateFilters.length + 2
          }
          tabIndex={0}
          onClick={() => setCreateFilter(true)}
          onKeyDown={(e) => {
            if (isPressing(e, Keys.Enter)) {
              setCreateFilter(true)
            }
          }}
        >
          <Plus />
          <span>Filtered Claim Template</span>
        </AddMetricCard>
      </MetricsWrapper>
      {createFilter && (
        <CreateFilterModal
          onClose={() => setCreateFilter(false)}
          onSave={createTemplate}
        />
      )}
    </>
  )
}
