import { css, Theme } from '@emotion/react'
import chroma from 'chroma-js'
import styled from '@emotion/styled'
import { isPressing, Keys } from '@hedvig-ui'
import React, { useState } from 'react'
import { DashboardNumbers } from 'types/generated/graphql'
import { Link } from 'react-router-dom'
import { useTemplateClaims } from 'portals/hope/features/claims/claim-templates/hooks/use-template-claims'
import { FilteredMetric } from 'portals/hope/features/claims/claim-templates/FilteredMetric'
import { Plus } from 'react-bootstrap-icons'
import { useHistory } from 'react-router'
import { CreateFilterModal } from '../claims/claim-templates/CreateFilterModal'
import { lightTheme, useNavigation } from '@hedvig-ui'

const MetricsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`

export const metricStyles = (theme: Theme) => css`
  display: flex;
  flex-direction: column;
  color: ${theme.accentContrast} !important;
  background: ${theme.accent};
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-right: 1rem;
  margin-bottom: 1rem;
  min-width: 200px;

  &:hover,
  &:focus {
    opacity: 0.8;
    color: ${theme.accentContrast}!important;
  }
`

const Metric = styled(Link)`
  ${({ theme }) => metricStyles(theme)}
`

const AddMetricCard = styled.div`
  transition: none;

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

  border: 2px dotted ${({ theme }) => theme.border};

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

interface MetricListProps {
  dashboardNumbers?: DashboardNumbers
}

export const MetricList: React.FC<MetricListProps> = ({ dashboardNumbers }) => {
  const [createFilter, setCreateFilter] = useState(false)

  const history = useHistory()
  const { register } = useNavigation()

  const {
    templateFilters,
    createTemplate,
    editTemplateWithName,
    removeTemplate,
  } = useTemplateClaims()

  return (
    <>
      <MetricsWrapper>
        <Metric
          to="/claims/list/1"
          {...register(
            'ClaimsMetric',
            {
              autoFocus: true,
              resolve: () => {
                history.push('/claims/list/1')
              },
              neighbors: {
                right: 'QuestionsMetric',
              },
            },
            {
              background: chroma(lightTheme.accent).brighten(0.8).hex(),
            },
          )}
        >
          <MetricNumber>{dashboardNumbers?.numberOfClaims || 0}</MetricNumber>
          <MetricName>claims</MetricName>
        </Metric>

        <Metric
          to="/questions"
          {...register(
            'QuestionsMetric',
            {
              resolve: () => {
                history.push('/questions')
              },
              neighbors: {
                left: 'ClaimsMetric',
                right: templateFilters.length
                  ? templateFilters[0].name
                  : 'Add Template',
              },
            },
            {
              background: chroma(lightTheme.accent).brighten(0.8).hex(),
            },
          )}
        >
          <MetricNumber>
            {dashboardNumbers?.numberOfQuestions || 0}
          </MetricNumber>
          <MetricName>questions</MetricName>
        </Metric>

        {templateFilters.map((template, index) => {
          const registeredTemplate = register(
            template.name,
            {
              resolve: () => {
                history.push(`/claims/list/1?template=${template.id}`)
              },
              neighbors: {
                left: index
                  ? templateFilters[index - 1].name
                  : 'QuestionsMetric',
                right:
                  index < templateFilters.length - 1
                    ? templateFilters[index + 1].name
                    : 'Add Template',
              },
            },
            {
              background: chroma(lightTheme.accent).brighten(0.8).hex(),
            },
          )

          return (
            <FilteredMetric
              onCreate={createTemplate}
              onRemove={removeTemplate}
              onEdit={editTemplateWithName}
              key={template.id}
              template={template}
              style={{
                ...registeredTemplate.style,
              }}
            />
          )
        })}

        <AddMetricCard
          {...register(
            'Add Template',
            {
              resolve: () => {
                setCreateFilter(true)
              },
              neighbors: {
                left: templateFilters.length
                  ? templateFilters[templateFilters.length - 1].name
                  : 'QuestionsMetric',
              },
            },
            {},
            { border: `2px dotted ${lightTheme.border}` },
          )}
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
      <CreateFilterModal
        onClose={() => setCreateFilter(false)}
        onSave={createTemplate}
        visible={createFilter}
      />
    </>
  )
}
