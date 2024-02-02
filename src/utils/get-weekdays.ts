interface GetWeekDaysProps {
  short?: boolean
}

export function getWeekDays({ short = false }: GetWeekDaysProps = {}) {
  const formatter = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' })

  return Array.from(Array(7).keys())
    .map((day) => formatter.format(new Date(Date.UTC(2021, 5, day))))
    .map((weekDay) => {
      if (short) {
        return weekDay.substring(0, 3).toUpperCase()
      }

      return weekDay.substring(1, 0).toUpperCase().concat(weekDay.substring(1))
    })
}
