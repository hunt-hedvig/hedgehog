import { Agreement } from 'api/generated/graphql'
import {
  InfoContainer,
  InfoRow,
  InfoText,
} from 'components/member/tabs/contracts-tab/contract'
import * as React from 'react'
import {
  getLineOfBusiness,
  isNorwegianHomeContent,
  isSwedishApartment,
  isSwedishHouse,
} from 'utils/agreement'
import { formatPostalCode, getEnumTitleCase } from 'utils/text'

export const AgreementInfo: React.FC<{ agreement: Agreement }> = ({
  agreement,
}) => {
  return (
    <InfoContainer>
      <InfoRow>
        Line of Business:{' '}
        <InfoText>{getEnumTitleCase(getLineOfBusiness(agreement))}</InfoText>
      </InfoRow>
      <InfoRow>
        Premium:{' '}
        <InfoText>
          {agreement.premium.amount} {agreement.premium.currency}
        </InfoText>
      </InfoRow>
      <InfoRow>
        Number Co-insured: <InfoText>{agreement.numberCoInsured}</InfoText>
      </InfoRow>
      {(isSwedishApartment(agreement) ||
        isSwedishHouse(agreement) ||
        isNorwegianHomeContent(agreement)) && (
        <>
          <InfoRow>
            Address:{' '}
            <InfoText>
              {agreement.address.street},{' '}
              {formatPostalCode(agreement.address.postalCode)}{' '}
              {agreement.address.city}
            </InfoText>
          </InfoRow>
          <InfoRow>
            Living Space:{' '}
            <InfoText>
              {agreement.squareMeters} m<sup>2</sup>
            </InfoText>
          </InfoRow>
        </>
      )}
      {isSwedishHouse(agreement) && (
        <>
          <InfoRow>
            Ancillary area:{' '}
            <InfoText>
              {agreement.ancillaryArea} m<sup>2</sup>
            </InfoText>
          </InfoRow>
          <InfoRow>
            Year of construction:{' '}
            <InfoText>{agreement.yearOfConstruction}</InfoText>
          </InfoRow>
          <InfoRow>
            Number of bathrooms:{' '}
            <InfoText>{agreement.numberOfBathrooms}</InfoText>
          </InfoRow>
          <InfoRow>
            Is subleted:{' '}
            <InfoText>{agreement.isSubleted ? 'Yes' : 'No'}</InfoText>
          </InfoRow>
          {agreement.extraBuildings.map((extraBuilding, index) => {
            return (
              <InfoRow key={extraBuilding.id!}>
                Extra building {index + 1}:{' '}
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
        Status: <InfoText>{getEnumTitleCase(agreement.status)}</InfoText>
      </InfoRow>
    </InfoContainer>
  )
}
