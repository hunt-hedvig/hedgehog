export const convertEnumToTitle = (enumText: string) => {
  return enumText
    .toLowerCase()
    .split('_')
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

export const convertCamelcaseToTitle = (text) =>
  text.charAt(0).toUpperCase() + text.substring(1).replace(/(\B[A-Z])/g, ' $1')

export const getCarrierText = (carrier: string) => {
  switch (carrier) {
    case 'EIR':
      return '⚠️ EIR'
    case 'HEDVIG':
      return 'Ⓗ Hedvig'
    case 'HDI':
      return '🗄 HDI'
  }
  return carrier
}

export const getTextFromEnumValue = (
  sentence: string,
  capitalized: boolean = false,
) => {
  return sentence
    .toLowerCase()
    .split('_')
    .map((word, index) => {
      if (capitalized || index === 0 || word === 'hedvig') {
        return word.charAt(0).toUpperCase() + word.slice(1)
      }
      return word
    })
    .join(' ')
}
