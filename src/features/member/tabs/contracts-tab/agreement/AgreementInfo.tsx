import styled from '@emotion/styled'
import { Button, InfoContainer, InfoRow, InfoText, Paragraph } from '@hedvig-ui'
import { EditStreetInput } from 'features/member/tabs/contracts-tab/agreement/EditStreetInput'
import React, { useState } from 'react'
import { PencilFill } from 'react-bootstrap-icons'
import { Contract, GenericAgreement } from 'types/generated/graphql'
import { formatMoney } from 'utils/money'
import {
  convertEnumToTitle,
  formatPostalCode,
  getCarrierText,
} from 'utils/text'

const AddressInfoRow = styled(Paragraph)`
  margin-bottom: 1rem;
  font-size: 1.5rem;
  display: inline-block;
`

const EditIconWrapper = styled('span')`
  font-size: 1rem;
`

export const AgreementInfo: React.FC<{
  contract: Contract
  agreement: GenericAgreement
}> = ({ contract, agreement }) => {
  const [editStreet, setEditStreet] = useState(false)
  return (
    <InfoContainer>
      {agreement.address && (
        <AddressInfoRow>
          {!editStreet && (
            <>
              {agreement.address.street}{' '}
              <Button variant="tertiary" onClick={() => setEditStreet(true)}>
                <EditIconWrapper>
                  <PencilFill />
                </EditIconWrapper>
              </Button>
            </>
          )}
          {editStreet && (
            <EditStreetInput
              agreementId={agreement.id}
              contract={contract}
              street={agreement.address.street}
              closeEdit={() => setEditStreet(false)}
            />
          )}
          <br />
          {formatPostalCode(agreement.address.postalCode)}{' '}
          {agreement.address.city}
        </AddressInfoRow>
      )}
      <br />
      {agreement.squareMeters && (
        <InfoRow>
          Living Space{' '}
          <InfoText>
            {agreement.squareMeters} m<sup>2</sup>
          </InfoText>
        </InfoRow>
      )}
      {agreement.ancillaryArea && (
        <InfoRow>
          Ancillary Area <InfoText>{agreement.ancillaryArea}</InfoText>
        </InfoRow>
      )}
      {agreement.yearOfConstruction && (
        <InfoRow>
          Year Of Construction{' '}
          <InfoText>{agreement.yearOfConstruction}</InfoText>
        </InfoRow>
      )}
      {agreement.numberOfBathrooms && (
        <InfoRow>
          Number of bathrooms <InfoText>{agreement.numberOfBathrooms}</InfoText>
        </InfoRow>
      )}
      {agreement.isSubleted && (
        <InfoRow>
          Is subleted <InfoText>{agreement.isSubleted ? 'Yes' : 'No'}</InfoText>
        </InfoRow>
      )}
      {agreement.extraBuildings &&
        agreement.extraBuildings.map((extraBuilding, index) => {
          return (
            <InfoRow key={extraBuilding.id!}>
              Extra building {index + 1}{' '}
              <InfoText>
                {extraBuilding.displayName}, {extraBuilding.area} m<sup>2</sup>{' '}
                {extraBuilding.hasWaterConnected ? '(Water connected)' : ''}
              </InfoText>
            </InfoRow>
          )
        })}
      {agreement.numberCoInsured !== undefined && (
        <InfoRow>
          Number Co-insured <InfoText>{agreement.numberCoInsured}</InfoText>
        </InfoRow>
      )}
      <InfoRow>
        Line of Business{' '}
        <InfoText>{convertEnumToTitle(agreement.lineOfBusinessName)}</InfoText>
      </InfoRow>
      <InfoRow>
        Carrier <InfoText>{getCarrierText(agreement.carrier)}</InfoText>
      </InfoRow>
      {agreement.partner ? (
        <InfoRow>
          Partner <InfoText>{convertEnumToTitle(agreement.partner)}</InfoText>
        </InfoRow>
      ) : null}
      <InfoRow>
        Premium{' '}
        <InfoText>
          {formatMoney(agreement.premium, { minimumFractionDigits: 0 })}
        </InfoText>
      </InfoRow>
      <InfoRow>
        Status <InfoText>{convertEnumToTitle(agreement.status)}</InfoText>
      </InfoRow>
    </InfoContainer>
  )
}
