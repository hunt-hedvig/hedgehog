import { MutationFunctionOptions } from '@apollo/client'
import {
  AssignCampaignToPartnerPercentageDiscountMutation,
  AssignCampaignToPartnerPercentageDiscountMutationHookResult,
  AssignCampaignToPartnerPercentageDiscountMutationVariables,
  AssignVoucherPercentageDiscount,
  useAssignCampaignToPartnerPercentageDiscountMutation,
} from 'types/generated/graphql'

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
    refetchQueries: () => ['FindPartnerCampaigns'],
  }
}
