import { MutationFunctionOptions } from '@apollo/client'
import {
  AssignCampaignToPartnerFreeMonthsMutation,
  AssignCampaignToPartnerFreeMonthsMutationHookResult,
  AssignCampaignToPartnerFreeMonthsMutationVariables,
  AssignVoucherFreeMonths,
  useAssignCampaignToPartnerFreeMonthsMutation,
} from 'types/generated/graphql'

export const useAddPartnerFreeMonthsCode = (): AssignCampaignToPartnerFreeMonthsMutationHookResult =>
  useAssignCampaignToPartnerFreeMonthsMutation()

export const addPartnerFreeMonthsCodeOptions = (
  request: AssignVoucherFreeMonths,
): MutationFunctionOptions<
  AssignCampaignToPartnerFreeMonthsMutation,
  AssignCampaignToPartnerFreeMonthsMutationVariables
> => {
  return {
    variables: {
      request,
    },
    refetchQueries: () => ['FindPartnerCampaigns'],
  }
}
