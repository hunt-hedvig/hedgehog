import styled from '@emotion/styled'
import { Trial } from 'api/generated/graphql'
import { Card, CardsWrapper } from 'hedvig-ui/card'
import { InfoContainer, InfoRow, InfoText } from 'hedvig-ui/info-row'
import { ThirdLevelHeadline } from 'hedvig-ui/typography'
import React from 'react'

const TrialWrapper = styled('div')`
  &:not(:first-of-type) {
    margin-top: 5rem;
    border-top: 1px solid ${({ theme }) => theme.border};
    padding-top: 5rem;
  }
`

export const TrialComponent: React.FC<{
  trial: Trial
}> = ({ trial }) => {
  return (
    <TrialWrapper>
      <CardsWrapper>
        <Card span={2}>
          <InfoContainer>
            <InfoRow>
              <ThirdLevelHeadline>{trial.displayName}</ThirdLevelHeadline>
            </InfoRow>
            <InfoRow>
              From date
              <InfoText>{trial.fromDate}</InfoText>
            </InfoRow>
            <InfoRow>
              To date
              <InfoText>{trial.toDate}</InfoText>
            </InfoRow>
            <InfoRow>
              Partner
              <InfoText>{trial.partner}</InfoText>
            </InfoRow>
            {trial.address.livingSpace ? (
              <InfoRow>
                Living space
                <InfoText>{trial.address.livingSpace}</InfoText>
              </InfoRow>
            ) : null}
          </InfoContainer>
        </Card>
        <Card span={2}>
          <InfoContainer>
            <InfoRow>
              <ThirdLevelHeadline>Address</ThirdLevelHeadline>
            </InfoRow>
            <InfoRow>
              Street
              <InfoText>{trial.address.street}</InfoText>
            </InfoRow>
            <InfoRow>
              Zip code
              <InfoText>{trial.address.zipCode}</InfoText>
            </InfoRow>
            <InfoRow>
              City
              <InfoText>{trial.address.city}</InfoText>
            </InfoRow>
            {trial.address.floor && (
              <InfoRow>
                Floor
                <InfoText>{trial.address.floor}</InfoText>
              </InfoRow>
            )}
            {trial.address.apartmentNo ? (
              <InfoRow>
                Apartment No
                <InfoText>{trial.address.apartmentNo}</InfoText>
              </InfoRow>
            ) : null}
          </InfoContainer>
        </Card>
      </CardsWrapper>
    </TrialWrapper>
  )
}
