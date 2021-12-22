import { Card, CardsWrapper, MainHeadline } from '@hedvig-ui'
import { Row } from 'portals/hope/features/tools/employees/components/CreateEmployee'
import { EmployeeFilter } from 'portals/hope/features/tools/employees/components/EmployeeFilter'
import { EmployeeTable } from 'portals/hope/features/tools/employees/components/EmployeeTable'
import React, { useState } from 'react'
import { useGetMeQuery } from 'types/generated/graphql'
import { Page } from 'portals/hope/pages/routes'

const EmployeesPage: Page = () => {
  const { data } = useGetMeQuery()
  const scopes = data?.me?.scopes ?? []

  const [filter, setFilter] = useState({
    email: '',
    role: '',
    label: '',
  })

  return (
    <>
      <Row>
        <MainHeadline>Employees</MainHeadline>
      </Row>
      <CardsWrapper>
        <Card>
          <EmployeeFilter
            scopes={scopes}
            filter={filter}
            setFilter={setFilter}
          />
        </Card>
        <EmployeeTable scopes={scopes} filter={filter} />
      </CardsWrapper>
    </>
  )
}

export default EmployeesPage
