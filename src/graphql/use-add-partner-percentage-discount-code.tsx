import { MutationFunctionOptions } from '@apollo/react-common'
import {
  AssignCampaignToPartnerPercentageDiscountMutation,
  AssignCampaignToPartnerPercentageDiscountMutationHookResult,
  AssignCampaignToPartnerPercentageDiscountMutationVariables,
  AssignVoucherPercentageDiscount,
  FindPartnerCampaignsDocument,
  useAssignCampaignToPartnerPercentageDiscountMutation,
} from '../api/generated/graphql'

export const useAddPartnerPercentageDiscountCode = (): AssignCampaignToPartnerPercentageDiscountMutationHookResult =>
  useAssignCampaignToPartnerPercentageDiscountMutation()

export const addPartnerPercentageDiscountCodeOptions = (
  request: AssignVoucherPercentageDiscount,
): MutationFunctionOptions<
  AssignCampaignToPartnerPercentageDiscountMutation,
  AssignCampaignToPartnerPercentageDiscountMutationVariables
> => {
  return {
    variables: {
      request,
    },
    refetchQueries: () => [
      {
        query: FindPartnerCampaignsDocument,
        variables: {
          code: request.code,
          partnerId: request.partnerId,
          activeFrom: request.validFrom,
          activeTo: request.validUntil,
        },
      },
    ],
  }
}