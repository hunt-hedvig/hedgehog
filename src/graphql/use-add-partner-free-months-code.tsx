import { MutationFunctionOptions } from '@apollo/react-common'
import {
  AssignCampaignToPartnerFreeMonthsMutation,
  AssignCampaignToPartnerFreeMonthsMutationHookResult,
  AssignCampaignToPartnerFreeMonthsMutationVariables,
  AssignVoucherFreeMonths,
  useAssignCampaignToPartnerFreeMonthsMutation,
} from 'api/generated/graphql'

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
