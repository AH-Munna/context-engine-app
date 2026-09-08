import {COLORS} from '../constants/theme';

export function getCalendarTheme(colors: any) {
  return {
    backgroundColor: colors.card,
    calendarBackground: colors.card,
    textSectionTitleColor: colors.text,
    dayTextColor: colors.title,
    todayTextColor: COLORS.coral,
    monthTextColor: colors.title,
    arrowColor: COLORS.teal,
    textDisabledColor: colors.text + '40',
    textDayFontWeight: '500' as const,
    textMonthFontWeight: '700' as const,
    textDayHeaderFontWeight: '600' as const,
    // Month/year is shown by our custom selector above the calendar.
    'stylesheet.calendar.header': {
      header: {
        height: 0,
        opacity: 0,
        margin: 0,
        padding: 0,
      },
      monthText: {
        height: 0,
        opacity: 0,
      },
    },
  };
}
