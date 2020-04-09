export const getEnumTitleCase = (enumText: string) => {
  return enumText
    .toLowerCase()
    .split('_')
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

export const formatPostalCode = (postalCode: string): string => {
  if (postalCode.length === 5) {
    return postalCode.slice(0, 3) + ' ' + postalCode.slice(3)
  }
  return postalCode
}
