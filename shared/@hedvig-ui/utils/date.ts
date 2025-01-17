import {
  differenceInCalendarDays,
  getYear,
  parse,
  parseISO,
  setYear,
} from 'date-fns'
import formatDate from 'date-fns/format'

export enum BirthDayInfo {
  Today = 'TODAY',
  Yesterday = 'YESTERDAY',
  Tomorrow = 'TOMORROW',
}

export const getBirthdayInfo = (
  birthDateString: string,
  today: Date = new Date(),
): BirthDayInfo | null => {
  let birthDate
  try {
    birthDate = parse(birthDateString, 'yyyy-MM-dd', new Date())
  } catch (e) {
    return null
  }
  const thisYear = getYear(today)
  if (
    differenceInCalendarDays(setYear(birthDate, thisYear), today) === 1 ||
    differenceInCalendarDays(setYear(birthDate, thisYear + 1), today) === 1
  ) {
    return BirthDayInfo.Tomorrow
  }
  if (
    differenceInCalendarDays(setYear(birthDate, thisYear), today) === -1 ||
    differenceInCalendarDays(setYear(birthDate, thisYear - 1), today) === -1
  ) {
    return BirthDayInfo.Yesterday
  }
  if (differenceInCalendarDays(setYear(birthDate, thisYear), today) === 0) {
    return BirthDayInfo.Today
  }
  return null
}

export const getBirthDayText = (birthDateString: string): string | null => {
  const birthDayInfo = getBirthdayInfo(birthDateString)
  switch (birthDayInfo) {
    case BirthDayInfo.Today:
      return 'Birthday today 🥳'
    case BirthDayInfo.Tomorrow:
      return 'Birthday tomorrow 🎁'
    case BirthDayInfo.Yesterday:
      return 'Birthday yesterday 🎂'
  }
  return null
}

export const dateTimeFormatter = (date: string | number, format: string) => {
  try {
    return (
      date &&
      formatDate(typeof date === 'string' ? parseISO(date) : date, format)
    )
  } catch (e) {
    console.error(e)
    return undefined
  }
}
