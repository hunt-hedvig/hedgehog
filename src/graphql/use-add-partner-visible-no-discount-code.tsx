import { MutationFunctionOptions } from '@apollo/client'
import {
  AssignCampaignToPartnerVisibleNoDiscountMutation,
  AssignCampaignToPartnerVisibleNoDiscountMutationHookResult,
  AssignCampaignToPartnerVisibleNoDiscountMutationVariables,
  AssignVoucherVisibleNoDiscount,
  useAssignCampaignToPartnerVisibleNoDiscountMutation,
} from 'types/generated/graphql'

export const useAddPartnerVisibleNoDiscountCode = (): AssignCampaignToPartnerVisibleNoDiscountMutationHookResult =>
  useAssignCampaignToPartnerVisibleNoDiscountMutation()

export const addPartnerVisibleNoDiscountCodeOptions = (
  request: AssignVoucherVisibleNoDiscount,
): MutationFunctionOptions<
  AssignCampaignToPartnerVisibleNoDiscountMutation,
  AssignCampaignToPartnerVisibleNoDiscountMutationVariables
> => {
  return {
    variables: {
      request,
    },
    refetchQueries: () => ['FindPartnerCampaigns'],
  }
}
