import { Breadcrumb } from '@hedvig-ui'
import React from 'react'

export default {
  title: 'Breadcrumb',
  component: Breadcrumb,
}

export const BreadcrumbStandard = () => (
  <Breadcrumb
    sections={[
      {
        key: 0,
        content: (
          <span
            style={{ cursor: 'pointer' }}
            onClick={() => alert('Dashborad')}
          >
            Dashborad
          </span>
        ),
        active: true,
      },
      {
        key: 1,
        content: (
          <span style={{ cursor: 'pointer' }} onClick={() => alert('Claims')}>
            Claims
          </span>
        ),
        active: true,
      },
      {
        key: 2,
        content: (
          <span style={{ cursor: 'pointer' }} onClick={() => alert('List')}>
            List
          </span>
        ),
        active: true,
      },
      {
        key: 3,
        content: (
          <span style={{ cursor: 'pointer' }} onClick={() => alert('1')}>
            1
          </span>
        ),
        active: true,
      },
    ]}
  />
)
