import { css, Theme } from '@emotion/react'
import styled from '@emotion/styled'
import React, { useState } from 'react'
import { DashboardNumbers } from 'types/generated/graphql'
import { Link } from 'react-router-dom'
import {
  ClaimFilterTemplate,
  useTemplateClaims,
} from 'portals/hope/features/claims/claim-templates/hooks/use-template-claims'
import { FilteredMetric } from 'portals/hope/features/claims/claim-templates/FilteredMetric'
import { Plus } from 'react-bootstrap-icons'
import { useHistory } from 'react-router'
import { CreateFilterModal } from '../claims/claim-templates/CreateFilterModal'
import { lightTheme, useNavigation } from '@hedvig-ui'
import chroma from 'chroma-js'

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
  const { registerList } = useNavigation()

  const {
    templateFilters,
    createTemplate,
    editTemplateWithName,
    removeTemplate,
  } = useTemplateClaims()

  interface MetricListType {
    name: string
    number?: number
    template?: ClaimFilterTemplate
    link: string
    addTemplate?: boolean
  }

  const templatesMetrics: MetricListType[] = templateFilters
    ? templateFilters.map((template) => ({
        name: template.name,
        link: `/claims/list/1?template=${template.id}`,
        template: template,
      }))
    : []

  const MetricsList: MetricListType[] = [
    {
      name: 'claims',
      number: dashboardNumbers?.numberOfClaims || 0,
      link: '/claims/list/1',
    },
    {
      name: 'questions',
      number: dashboardNumbers?.numberOfQuestions || 0,
      link: '/questions',
    },
    ...templatesMetrics,
    {
      name: 'add-template',
      link: '',
      addTemplate: true,
    },
  ]

  const { registerItem } = registerList({
    list: MetricsList,
    name: 'MetricList',
    nameField: 'name',
    autoFocus: true,
    resolve: (item) =>
      !item.addTemplate && item.link
        ? history.push(item.link)
        : setCreateFilter(true),
    isHorizontal: true,
    styles: (item) => {
      return {
        basic: item.addTemplate
          ? {
              border: `2px dotted ${lightTheme.border}`,
            }
          : {},
        focus: !item.addTemplate
          ? {
              background: chroma(lightTheme.accent).brighten(0.8).hex(),
            }
          : {},
      }
    },
  })

  return (
    <>
      <MetricsWrapper>
        {MetricsList.map((metric) =>
          !metric.template && !metric.addTemplate ? (
            <Metric to={metric.link} {...registerItem(metric)}>
              <MetricNumber>{metric.number}</MetricNumber>
              <MetricName>{metric.name}</MetricName>
            </Metric>
          ) : metric.template && !metric.addTemplate ? (
            <FilteredMetric
              onCreate={createTemplate}
              onRemove={removeTemplate}
              onEdit={editTemplateWithName}
              key={metric.template.id}
              template={metric.template}
              {...registerItem(metric)}
            />
          ) : (
            <AddMetricCard
              {...registerItem(metric)}
              tabIndex={0}
              onClick={() => setCreateFilter(true)}
            >
              <Plus />
              <span>Filtered Claim Template</span>
            </AddMetricCard>
          ),
        )}
      </MetricsWrapper>
      <CreateFilterModal
        onClose={() => setCreateFilter(false)}
        onSave={createTemplate}
        visible={createFilter}
      />
    </>
  )
}
