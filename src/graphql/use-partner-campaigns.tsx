import {
  FindPartnerCampaignsQueryResult,
  useFindPartnerCampaignsQuery,
  VoucherCampaign,
} from 'api/generated/graphql'

type VoucherCampaignReturnTuple = [
  ReadonlyArray<VoucherCampaign>,
  FindPartnerCampaignsQueryResult,
]

export const usePartnerCampaigns = (): VoucherCampaignReturnTuple => {
  const queryResult = useFindPartnerCampaignsQuery()
  const voucherCampaigns = (queryResult.data?.findPartnerCampaigns ??
    []) as VoucherCampaign[]
  return [voucherCampaigns, queryResult]
}
