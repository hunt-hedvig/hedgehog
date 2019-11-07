
export const createCreateQuoteFromProductRequest = (modifiedDetails) => {
  const requestData: any = {
    originatingProductId: modifiedDetails.productId,
    currentInsurer: modifiedDetails.currentInsurer,
  }
  const requestQuoteData = {
    street: modifiedDetails.street,
    city: modifiedDetails.city,
    zipCode: modifiedDetails.zipCode,
    livingSpace: modifiedDetails.livingSpace,
    householdSize: modifiedDetails.personsInHouseHold,
  }

  if (modifiedDetails.productType === "HOUSE") {
    requestData.incompleteHouseQuoteData = {
      ...requestQuoteData,
      floor: modifiedDetails.floor,
      isStudent: false,
      ancillaryArea: modifiedDetails.ancillaryArea,
      yearOfConstruction: modifiedDetails.yearOfConstruction,
      numberOfBathrooms: modifiedDetails.numberOfBathrooms,
      extraBuildings: modifiedDetails.extraBuildings,
      isSubleted: modifiedDetails.isSubleted,
    }
  } else {
    requestData.incompleteApartmentQuoteData = {
      ...requestQuoteData,
      subType: modifiedDetails.insuranceType,
      isStudent: modifiedDetails.isStudent,
    }
  }

  return requestData
}
