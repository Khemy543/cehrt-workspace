// https://date-fns.org/docs/parse
import parseDate from 'date-fns/parse'
// https://date-fns.org/docs/format
import format from 'date-fns/format'
import differenceInCalendarDays from 'date-fns/difference_in_calendar_days'

export function formatDate(date) {
  date = parseDate(date)
  return format(date, 'MMM Do, YYYY')
}

export const dateFormate = (date) => {
  date = parseDate(date);
  return format(date, "YYYY-MM-DD")
} 

export const dateDifference = (later, earlier) => {
  later = parseDate(later);
  earlier = parseDate(earlier);
  return differenceInCalendarDays(later, earlier)
}