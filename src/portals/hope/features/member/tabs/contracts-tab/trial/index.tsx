import styled from '@emotion/styled'
import {
  Button,
  Card,
  CardsWrapper,
  InfoContainer,
  InfoRow,
  InfoText,
  Paragraph,
  ThirdLevelHeadline,
} from '@hedvig-ui'
import { convertEnumToTitle } from '@hedvig-ui'
import React from 'react'
import { Trial } from 'types/generated/graphql'

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
            {trial.address.livingSpace && (
              <InfoRow>
                Living space
                <InfoText>{trial.address.livingSpace}</InfoText>
              </InfoRow>
            )}
            <InfoRow>
              Status
              <InfoText>{convertEnumToTitle(trial.status)}</InfoText>
            </InfoRow>
          </InfoContainer>
        </Card>
        <Card span={2}>
          <ThirdLevelHeadline>Address</ThirdLevelHeadline>
          <InfoContainer>
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
        <Card span={2}>
          <ThirdLevelHeadline>Trial Insurance Certificate</ThirdLevelHeadline>
          {trial.certificateUrl ? (
            <Button
              onClick={() => {
                if (!trial.certificateUrl) {
                  return
                }

                window.open(trial.certificateUrl, '_link')
              }}
            >
              View
            </Button>
          ) : (
            <Paragraph>No insurance certificate available</Paragraph>
          )}
        </Card>
        <Card span={2}>
          <ThirdLevelHeadline>Debugging</ThirdLevelHeadline>
          <InfoContainer>
            <InfoRow>
              Trial id
              <InfoText>{trial.id}</InfoText>
            </InfoRow>
            <InfoRow>
              Created at
              <InfoText>{trial.createdAt}</InfoText>
            </InfoRow>
          </InfoContainer>
        </Card>
      </CardsWrapper>
    </TrialWrapper>
  )
}
