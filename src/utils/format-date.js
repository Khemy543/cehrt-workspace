// https://date-fns.org/docs/format
import { isAfter, addBusinessDays, differenceInCalendarDays, formatISO9075, format, differenceInBusinessDays } from 'date-fns'

export const dateFormate = (date) => {
  return formatISO9075(new Date(date), { representation: 'date' })
}

export const formateDate = (date) => {
  return format(new Date(date), "do MMM yyyy")
}

export const calendarFormat = (date) => {
  return formatISO9075(new Date(date))
}

export const slashDateFormate = (date) => {
  return format(new Date(date), 'dd/MM/yyy')
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

export const getDifferenceInBusinessDays = (later, earlier) => {
  return differenceInBusinessDays(new Date(later), new Date(earlier))
}