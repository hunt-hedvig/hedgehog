import React from 'react'
import styled from '@emotion/styled'
import { ThirdLevelHeadline, InfoRow, InfoText } from '@hedvig-ui'
import {
  GenericAgreement,
  useGetTermsAndConditionsQuery,
  UserSettingKey,
} from 'types/generated/graphql'
import { useMe } from 'portals/hope/features/user/hooks/use-me'

const Headline = styled(ThirdLevelHeadline)`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;

  & a {
    font-size: 1rem;
  }
`

interface TermsAndConditionsProps {
  agreement: GenericAgreement
  locale: string
}

export const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({
  agreement: { typeOfContract, partner, carrier, createdAt },
  locale,
}) => {
  const { settings } = useMe()

  const { data } = useGetTermsAndConditionsQuery({
    variables: {
      contractType: typeOfContract,
      partner,
      carrier,
      date: createdAt.split('T')[0],
      locale: settings[UserSettingKey.Languages] || locale || 'en_SE',
    },
  })

  if (!data?.termsAndConditions) {
    return null
  }

  return (
    <>
      <Headline>
        <span>Terms and Conditions</span>
        <a
          href={data.termsAndConditions.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Link
        </a>
      </Headline>
      <InfoRow>
        Name <InfoText>{data.termsAndConditions.displayName}</InfoText>
      </InfoRow>
      <InfoRow>
        Commencement Date
        <InfoText>{data.termsAndConditions.commencementDate}</InfoText>
      </InfoRow>
    </>
  )
}
