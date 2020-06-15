import { MutationFunctionOptions } from '@apollo/react-common'
import {
  UpsertItemBrandMutation,
  UpsertItemBrandMutationVariables,
  UpsertItemCompanyMutation,
  UpsertItemCompanyMutationVariables,
  UpsertItemModelMutation,
  UpsertItemModelMutationVariables,
  UpsertItemTypeMutation,
  UpsertItemTypeMutationVariables,
} from 'api/generated/graphql'

export const useUpsertItemTypeOptions = (
  name: string,
  itemFamilyId: string,
): MutationFunctionOptions<
  UpsertItemTypeMutation,
  UpsertItemTypeMutationVariables
> => {
  return {
    variables: {
      request: {
        name,
        itemFamilyId,
      },
    },
    refetchQueries: ['GetItemCategories'],
  }
}

export const useUpsertItemBrandOptions = (
  name: string,
  itemTypeId: string,
  itemCompanyId: string,
): MutationFunctionOptions<
  UpsertItemBrandMutation,
  UpsertItemBrandMutationVariables
> => {
  return {
    variables: {
      request: {
        name,
        itemTypeId,
        itemCompanyId,
      },
    },
    refetchQueries: ['GetItemCategories'],
  }
}

export const useUpsertItemModelOptions = (
  name: string,
  itemBrandId: string,
): MutationFunctionOptions<
  UpsertItemModelMutation,
  UpsertItemModelMutationVariables
> => {
  return {
    variables: {
      request: {
        name,
        itemBrandId,
      },
    },
    refetchQueries: ['GetItemCategories'],
  }
}

export const useUpsertItemCompanyOptions = (
  name: string,
): MutationFunctionOptions<
  UpsertItemCompanyMutation,
  UpsertItemCompanyMutationVariables
> => {
  return {
    variables: {
      request: {
        name,
      },
    },
    refetchQueries: ['GetItemCategories'],
  }
}
