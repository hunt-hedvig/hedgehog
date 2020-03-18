export const getTextFromEnumValue = (sentence: string) => {
  return sentence
    .toLowerCase()
    .split('_')
    .map((word, index) => {
      if (index === 0 || word === 'hedvig') {
        return word.charAt(0).toUpperCase() + word.slice(1)
      }
      return word
    })
    .join(' ')
}
