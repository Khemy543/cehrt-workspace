// https://date-fns.org/docs/format
import { isAfter, addBusinessDays, differenceInCalendarDays, formatISO9075 } from 'date-fns'

export const dateFormate = (date) => {
  return formatISO9075(new Date(date), { representation: 'date' })
}

export const calendarFormat = (date) => {
  return formatISO9075(new Date(date))
}


export const dateDifference = (later, earlier) => {
  
  return differenceInCalendarDays(new Date(later), new Date(earlier))
}

export const isDateAfter = (firstDate, secondDate) => {
  return isAfter(new Date(firstDate), new Date(secondDate));
}

export const getAddedDate = (date, days) => {
  return addBusinessDays(new Date(date), days)
}