// https://date-fns.org/docs/parse
import parseDate from 'date-fns/parse'
// https://date-fns.org/docs/format
import format from 'date-fns/format'

export function formatDate(date) {
  date = parseDate(date)
  return format(date, 'MMM Do, YYYY')
}

export const dateFormate = (date) => {
  date = parseDate(date);
  return format(date, "YYYY-MM-DD")
} 