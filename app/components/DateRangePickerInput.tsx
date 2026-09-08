import React, {useState, useMemo, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useTheme} from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {Calendar} from 'react-native-calendars';
import {COLORS, FONTS, SIZES} from '../constants/theme';
import MonthYearPickerView from './MonthYearPickerView';
import BottomSheet from './ui/BottomSheet';
import {getCalendarTheme} from './calendarPickerTheme';
import {
  toDateOnlyString,
  parseDateOnly,
  formatDateOnlyDisplay,
  formatMonthYearDisplay,
  toMonthStartString,
  parseMonthStart,
  getTripDatePickerBounds,
} from '../utils/dateOnly';

export interface DateRangePickerInputProps {
  value: [Date | null, Date | null];
  onChange: (range: [Date, Date]) => void;
  placeholder: string;
  icon: React.ReactNode;
  style?: any;
  placeholderTextColor?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  /**
   * Render the calendar directly instead of behind its own popup Modal.
   * Use this when the component already lives inside another
   * Modal/BottomSheet — stacking two Modals is unreliable on Android,
   * which can fail to repaint the outer Modal after the inner one
   * closes until another interaction forces a relayout (looks like the
   * picked range "disappearing" until you reopen the sheet).
   */
  renderInline?: boolean;
}

const toDateStr = (d: Date) => {
  if (d && !isNaN(d.getTime())) {
    return toDateOnlyString(d);
  }
  return null;
};

const DateRangePickerInput: React.FC<DateRangePickerInputProps> = ({
  value,
  onChange,
  placeholder,
  icon,
  style,
  placeholderTextColor,
  minimumDate,
  maximumDate,
  renderInline = false,
}) => {
  const theme = useTheme();
  const {colors}: {colors: any} = theme;
  const st = styles(colors);
  const tripBounds = getTripDatePickerBounds();
  const minDate = minimumDate ?? tripBounds.minimumDate;
  const maxDate = maximumDate ?? tripBounds.maximumDate;

  const [visible, setVisible] = useState(false);
  const [pickerMode, setPickerMode] = useState<'calendar' | 'monthYear'>(
    'calendar',
  );
  const [visibleMonth, setVisibleMonth] = useState(() =>
    toMonthStartString(new Date()),
  );
  const [startDate, setStartDate] = useState<string | null>(
    value[0] ? toDateStr(value[0]) : null,
  );
  const [endDate, setEndDate] = useState<string | null>(
    value[1] ? toDateStr(value[1]) : null,
  );

  useEffect(() => {
    setStartDate(value[0] ? toDateStr(value[0]) : null);
    setEndDate(value[1] ? toDateStr(value[1]) : null);
  }, [value]);

  useEffect(() => {
    if (!renderInline && !visible) {
      return;
    }
    setPickerMode('calendar');
    const anchor = value[0] ?? new Date();
    setVisibleMonth(toMonthStartString(anchor));
  }, [renderInline, visible, value]);

  const markedDates = useMemo(() => {
    const marks: any = {};
    if (!startDate) {
      return marks;
    }

    if (!endDate) {
      marks[startDate] = {
        startingDay: true,
        endingDay: true,
        color: COLORS.teal,
        textColor: '#fff',
      };
      return marks;
    }

    const start = parseDateOnly(startDate);
    const end = parseDateOnly(endDate);
    const current = new Date(start);

    while (current <= end) {
      const key = toDateStr(current);
      if (!key) {
        break;
      }
      const isStart = key === startDate;
      const isEnd = key === endDate;
      marks[key] = {
        startingDay: isStart,
        endingDay: isEnd,
        color: isStart || isEnd ? COLORS.teal : COLORS.teal + '30',
        textColor: isStart || isEnd ? '#fff' : colors.title,
      };
      current.setDate(current.getDate() + 1);
    }
    return marks;
  }, [startDate, endDate, colors.title]);

  const handleDayPress = (day: any) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day.dateString);
      setEndDate(null);
      return;
    }
    const newStart = day.dateString < startDate ? day.dateString : startDate;
    const newEnd = day.dateString < startDate ? startDate : day.dateString;
    setStartDate(newStart);
    setEndDate(newEnd);
    // Inline mode has no separate "Confirm" step (the host screen provides
    // its own apply/close action), so commit the range as soon as both
    // ends are picked.
    if (renderInline) {
      onChange([parseDateOnly(newStart), parseDateOnly(newEnd)]);
    }
  };

  const handleConfirm = () => {
    if (startDate && endDate) {
      onChange([parseDateOnly(startDate), parseDateOnly(endDate)]);
    }
    setVisible(false);
  };

  const handleCancel = () => {
    setStartDate(value[0] ? toDateStr(value[0]) : null);
    setEndDate(value[1] ? toDateStr(value[1]) : null);
    setPickerMode('calendar');
    setVisible(false);
  };

  const formatDisplay = () => {
    if (value[0] && value[1]) {
      return `${formatDateOnlyDisplay(value[0])} – ${formatDateOnlyDisplay(value[1])}`;
    }
    return placeholder;
  };

  const formatHintRange = () => {
    if (!startDate) {
      return 'Tap a start date';
    }
    const startLabel = formatDateOnlyDisplay(parseDateOnly(startDate));
    if (!endDate) {
      return `${startLabel} — now tap an end date`;
    }
    return `${startLabel}  →  ${formatDateOnlyDisplay(parseDateOnly(endDate))}`;
  };

  const monthHeaderLabel = formatMonthYearDisplay(parseMonthStart(visibleMonth));

  if (renderInline) {
    return (
      <View style={style}>
        <Text style={[st.inlineHint, {color: colors.textLight}]}>
          {formatHintRange()}
        </Text>
        {pickerMode === 'monthYear' ? (
          <MonthYearPickerView
            date={parseMonthStart(visibleMonth)}
            minimumDate={minDate}
            maximumDate={maxDate}
            confirmLabel="Show calendar"
            onConfirm={date => {
              setVisibleMonth(toMonthStartString(date));
              setPickerMode('calendar');
            }}
          />
        ) : (
          <>
            <TouchableOpacity
              style={st.monthHeaderBtn}
              onPress={() => setPickerMode('monthYear')}
              activeOpacity={0.7}>
              <Text style={[st.monthHeaderText, {color: colors.title}]}>
                {monthHeaderLabel}
              </Text>
              <FeatherIcon name="chevron-down" size={18} color={COLORS.teal} />
            </TouchableOpacity>

            <Calendar
              key={visibleMonth}
              markingType="period"
              markedDates={markedDates}
              onDayPress={handleDayPress}
              current={visibleMonth}
              hideArrows
              enableSwipeMonths={false}
              renderHeader={() => null}
              minDate={toDateOnlyString(minDate)}
              maxDate={toDateOnlyString(maxDate)}
              style={st.calendar}
              theme={getCalendarTheme(colors)}
            />
          </>
        )}
      </View>
    );
  }

  return (
    <>
      <TouchableOpacity
        style={[st.row, style]}
        onPress={() => setVisible(true)}>
        <Text
          style={[
            st.text,
            !value[0] && {color: placeholderTextColor || colors.text + '99'},
          ]}>
          {formatDisplay()}
        </Text>
        <View style={{marginLeft: 8}}>{icon}</View>
      </TouchableOpacity>

      <BottomSheet
        visible={visible}
        onClose={handleCancel}
        title={
          pickerMode === 'monthYear' ? 'Select Month & Year' : 'Select Date Range'
        }
        subtitle={
          pickerMode === 'monthYear'
            ? 'Choose a month, then pick your dates on the calendar'
            : formatHintRange()
        }
        showBack={pickerMode === 'monthYear'}
        onBack={() => setPickerMode('calendar')}
        scrollable={false}
        bodyContentStyle={{paddingHorizontal: 0}}>
        {pickerMode === 'monthYear' ? (
          <MonthYearPickerView
            date={parseMonthStart(visibleMonth)}
            minimumDate={minDate}
            maximumDate={maxDate}
            confirmLabel="Show calendar"
            onConfirm={date => {
              setVisibleMonth(toMonthStartString(date));
              setPickerMode('calendar');
            }}
          />
        ) : (
          <View style={{paddingHorizontal: 16}}>
            <TouchableOpacity
              style={st.monthHeaderBtn}
              onPress={() => setPickerMode('monthYear')}
              activeOpacity={0.7}>
              <Text style={[st.monthHeaderText, {color: colors.title}]}>
                {monthHeaderLabel}
              </Text>
              <FeatherIcon name="chevron-down" size={18} color={COLORS.teal} />
            </TouchableOpacity>

            <Calendar
              key={visibleMonth}
              markingType="period"
              markedDates={markedDates}
              onDayPress={handleDayPress}
              current={visibleMonth}
              hideArrows
              enableSwipeMonths={false}
              renderHeader={() => null}
              minDate={toDateOnlyString(minDate)}
              maxDate={toDateOnlyString(maxDate)}
              style={st.calendar}
              theme={getCalendarTheme(colors)}
            />

            <View style={st.modalActions}>
              <TouchableOpacity onPress={handleCancel} style={st.cancelBtn}>
                <Text style={{color: colors.text, fontSize: 15, fontWeight: '600'}}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirm}
                disabled={!startDate || !endDate}
                style={[
                  st.confirmBtn,
                  (!startDate || !endDate) && {opacity: 0.4},
                ]}>
                <Text style={{color: '#fff', fontSize: 15, fontWeight: '600'}}>
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </BottomSheet>
    </>
  );
};

const styles = (colors: any) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      justifyContent: 'space-between',
    },
    text: {
      ...FONTS.font,
      color: colors.title,
      fontSize: 15,
    },
    inlineHint: {
      ...FONTS.font,
      fontSize: 14,
      textAlign: 'center',
      marginBottom: 10,
    },
    calendar: {
      backgroundColor: colors.card,
    },
    monthHeaderBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: 8,
      marginBottom: 4,
    },
    monthHeaderText: {
      ...FONTS.fontBold,
      fontSize: 16,
    },
    modalActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 12,
      marginTop: 16,
    },
    cancelBtn: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: SIZES.radius_sm,
    },
    confirmBtn: {
      paddingVertical: 10,
      paddingHorizontal: 24,
      borderRadius: SIZES.radius_sm,
      backgroundColor: COLORS.teal,
    },
  });

export default DateRangePickerInput;
