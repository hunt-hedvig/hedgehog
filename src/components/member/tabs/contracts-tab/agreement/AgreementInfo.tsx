import { Agreement } from 'api/generated/graphql'
import {
  InfoContainer,
  InfoRow,
  InfoText,
} from 'components/member/tabs/contracts-tab/contract'
import { Paragraph } from 'hedvig-ui/typography'
import React from 'react'
import styled from 'react-emotion'
import {
  getLineOfBusiness,
  isNorwegianHomeContent,
  isSwedishApartment,
  isSwedishHouse,
} from 'utils/agreement'
import { formatMoney } from 'utils/money'
import { formatPostalCode, getEnumTitleCase } from 'utils/text'

const AddressInfoRow = styled(Paragraph)`
  margin-bottom: 1rem;
  font-size: 1.5rem;
  display: inline-block;
`

export const AgreementInfo: React.FC<{ agreement: Agreement }> = ({
  agreement,
}) => {
  return (
    <InfoContainer>
      {(isSwedishApartment(agreement) ||
        isSwedishHouse(agreement) ||
        isNorwegianHomeContent(agreement)) && (
        <>
          <AddressInfoRow>
            {agreement.address.street}
            <br />
            {formatPostalCode(agreement.address.postalCode)}{' '}
            {agreement.address.city}
          </AddressInfoRow>
          <br />
          <InfoRow>
            Living Space{' '}
            <InfoText>
              {agreement.squareMeters} m<sup>2</sup>
            </InfoText>
          </InfoRow>
        </>
      )}
      {isSwedishHouse(agreement) && (
        <>
          <InfoRow>
            Ancillary area{' '}
            <InfoText>
              {agreement.ancillaryArea} m<sup>2</sup>
            </InfoText>
          </InfoRow>
          <InfoRow>
            Year of construction{' '}
            <InfoText>{agreement.yearOfConstruction}</InfoText>
          </InfoRow>
          <InfoRow>
            Number of bathrooms{' '}
            <InfoText>{agreement.numberOfBathrooms}</InfoText>
          </InfoRow>
          <InfoRow>
            Is subleted{' '}
            <InfoText>{agreement.isSubleted ? 'Yes' : 'No'}</InfoText>
          </InfoRow>
          {agreement.extraBuildings.map((extraBuilding, index) => {
            return (
              <InfoRow key={extraBuilding.id!}>
                Extra building {index + 1}{' '}
                <InfoText>
                  {extraBuilding.displayName}, {extraBuilding.area} m
                  <sup>2</sup>{' '}
                  {extraBuilding.hasWaterConnected ? '(Water connected)' : ''}
                </InfoText>
              </InfoRow>
            )
          })}
        </>
      )}
      <InfoRow>
        Number Co-insured <InfoText>{agreement.numberCoInsured}</InfoText>
      </InfoRow>
      <InfoRow>
        Line of Business{' '}
        <InfoText>{getEnumTitleCase(getLineOfBusiness(agreement))}</InfoText>
      </InfoRow>
      <InfoRow>
        Premium <InfoText>{formatMoney(agreement.premium)}</InfoText>
      </InfoRow>
      <InfoRow>
        Status <InfoText>{getEnumTitleCase(agreement.status)}</InfoText>
      </InfoRow>
    </InfoContainer>
  )
}
