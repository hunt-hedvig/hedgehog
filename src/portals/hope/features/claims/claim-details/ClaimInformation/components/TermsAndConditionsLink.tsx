import React from 'react'
import { useMe } from 'portals/hope/features/user/hooks/use-me'
import {
  useGetTermsAndConditionsQuery,
  UserSettingKey,
} from 'types/generated/graphql'

export const TermsAndConditionsLink: React.FC<{
  typeOfContract: string
  partner: string | null
  carrier: string
  createdAt: string
}> = ({ typeOfContract, partner, carrier, createdAt }) => {
  const { settings } = useMe()

  const { data } = useGetTermsAndConditionsQuery({
    variables: {
      contractType: typeOfContract,
      partner,
      carrier,
      date: createdAt.split('T')[0],
      locale: settings[UserSettingKey.Languages] || 'en_SE',
    },
  })

  if (!data?.termsAndConditions) {
    return null
  }

  return (
    <a
      href={data.termsAndConditions.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        fontSize: '0.9rem',
      }}
    >
      Terms and Conditions
    </a>
  )
}
