// https://date-fns.org/docs/parse
import parseDate from 'date-fns/parse'
// https://date-fns.org/docs/format
import { isAfter, addBusinessDays, differenceInCalendarDays, format } from 'date-fns'

export function formatDate(date) {
  date = parseDate(date)
  return format(date, 'MMM Do, YYYY')
}

export const dateFormate = (date) => {
  date = parseDate(date);
  return format(date, "YYYY-MM-DD")
}

export const calendarFormat = (date) => {
  date = parseDate(date);
  return format(date, "YYYY-MM-DDTHH:mm")
}


export const dateDifference = (later, earlier) => {
  later = parseDate(later);
  earlier = parseDate(earlier);
  return differenceInCalendarDays(later, earlier)
}

export const isDateAfter = (firstDate, secondDate) => {
  return isAfter(firstDate, secondDate);
}

export const getAddedDate = (date, days) => {
  return addBusinessDays(date, days)
}