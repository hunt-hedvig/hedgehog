export function timeAgo(pastDate: Date) {
  const date = new Date(pastDate)
  const today = new Date()
  if (today.getMilliseconds() - date.getMilliseconds() > 0) {
    throw Error('Cannot get timeAgo for date in the future')
  }
  return dateDifference(date, today)
}

function dateDifference(startingDate, endingDate) {
  let startDate = new Date(startingDate)
  let endDate = new Date(endingDate)
  if (startDate > endDate) {
    const swap = startDate
    startDate = endDate
    endDate = swap
  }
  const startYear = startDate.getFullYear()
  const february =
    (startYear % 4 === 0 && startYear % 100 !== 0) || startYear % 400 === 0
      ? 29
      : 28
  const daysInMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

  let yearDiff = endDate.getFullYear() - startYear
  let monthDiff = endDate.getMonth() - startDate.getMonth()
  if (monthDiff < 0) {
    yearDiff--
    monthDiff += 12
  }
  let dayDiff = endDate.getDate() - startDate.getDate()
  if (dayDiff < 0) {
    if (monthDiff > 0) {
      monthDiff--
    } else {
      yearDiff--
      monthDiff = 11
    }
    dayDiff += daysInMonth[startDate.getMonth()]
  }
  let result = ''
  if (yearDiff > 0) {
    result += yearDiff + ' years '
  }
  if (monthDiff > 0) {
    result += monthDiff + ' months '
  }
  if (dayDiff > 0) {
    result += dayDiff + ' days '
  }
  result += 'ago'
  if (yearDiff === 0 && monthDiff === 0) {
    if (dayDiff === 1) {
      result = 'Yesterday'
    }
    if (dayDiff === 0) {
      result = 'Today'
    }
  }
  return result
}
