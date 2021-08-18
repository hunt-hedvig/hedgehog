import styled from '@emotion/styled'
import { EmployeeFilter } from 'features/tools/employees/components/EmployeeFilter'
import { EmployeeTable } from 'features/tools/employees/components/EmployeeTable'
import { Card, CardsWrapper } from 'hedvig-ui/card'
import { MainHeadline } from 'hedvig-ui/typography'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { BackofficeStore } from 'store/storeTypes'

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

export const EmployeesComponent: React.FC<{ scopes: readonly string[] }> = ({
  scopes,
}) => {
  const [filter, setFilter] = useState({
    email: '',
    role: '',
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

export const Employees = connect((state: BackofficeStore) => ({
  scopes: state.auth.scopes,
}))(EmployeesComponent)
