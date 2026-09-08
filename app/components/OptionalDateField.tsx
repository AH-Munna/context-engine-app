import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {Calendar} from 'react-native-calendars';
import {COLORS, FONTS, SIZES} from '../constants/theme';
import {
  formatDateOnlyDisplay,
  formatMonthYearDisplay,
  parseDateOnly,
  parseMonthStart,
  toDateOnlyString,
  toMonthStartString,
} from '../utils/dateOnly';
import MonthYearPickerModal from './MonthYearPickerModal';
import MonthYearPickerView from './MonthYearPickerView';
import BottomSheet from './ui/BottomSheet';
import {getCalendarTheme} from './calendarPickerTheme';

export interface OptionalDateFieldProps {
  label?: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  format?: 'full' | 'monthYear';
  placeholder?: string;
  showLabel?: boolean;
  containerStyle?: ViewStyle;
  minimumDate?: Date;
  maximumDate?: Date;
}

const OptionalDateField: React.FC<OptionalDateFieldProps> = ({
  label = 'When did you go? (Optional)',
  value,
  onChange,
  format = 'full',
  placeholder = 'Add date (optional)',
  showLabel = true,
  containerStyle,
  minimumDate,
  maximumDate,
}) => {
  const theme = useTheme();
  const {colors}: {colors: any} = theme;
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<'calendar' | 'monthYear'>(
    'calendar',
  );
  const [visibleMonth, setVisibleMonth] = useState(() =>
    toMonthStartString(new Date()),
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(
    value ? toDateOnlyString(value) : null,
  );

  const resolvedPlaceholder =
    format === 'monthYear' ? 'Add month/year (optional)' : placeholder;

  const fullMinDate = minimumDate ?? new Date(1950, 0, 1);
  const fullMaxDate = maximumDate ?? new Date();

  const displayValue = value
    ? format === 'monthYear'
      ? formatMonthYearDisplay(value)
      : formatDateOnlyDisplay(value)
    : resolvedPlaceholder;

  const normalizeDate = (date: Date) => {
    if (format !== 'monthYear') {
      return date;
    }
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  useEffect(() => {
    if (!showPicker || format !== 'full') {
      return;
    }
    setPickerMode('calendar');
    const anchor = value ?? new Date();
    setVisibleMonth(toMonthStartString(anchor));
    setSelectedDate(value ? toDateOnlyString(value) : null);
  }, [showPicker, value, format]);

  const markedDates = useMemo(() => {
    if (!selectedDate) {
      return {};
    }
    return {
      [selectedDate]: {
        selected: true,
        selectedColor: COLORS.teal,
        selectedTextColor: '#fff',
      },
    };
  }, [selectedDate]);

  const closePicker = () => {
    setShowPicker(false);
    setPickerMode('calendar');
  };

  return (
    <View style={containerStyle}>
      {showLabel && (
        <Text style={[st.label, {color: colors.text}]}>{label}</Text>
      )}
      <View style={st.row}>
        <TouchableOpacity
          onPress={() => setShowPicker(true)}
          style={[
            st.inputRow,
            {
              flex: 1,
              backgroundColor: colors.card,
              borderColor: colors.border || '#E0DCD5',
            },
          ]}>
          <Text
            style={[
              st.inputText,
              {color: colors.title},
              !value && {color: colors.text + '99'},
            ]}>
            {displayValue}
          </Text>
          <FeatherIcon name="calendar" size={18} color={COLORS.coral} />
        </TouchableOpacity>
        {value ? (
          <TouchableOpacity
            onPress={() => onChange(null)}
            accessibilityLabel="Clear date"
            style={[
              st.clearBtn,
              {borderColor: colors.border || '#E0DCD5'},
            ]}>
            <FeatherIcon name="x" size={18} color={colors.text} />
          </TouchableOpacity>
        ) : null}
      </View>

      {format === 'monthYear' ? (
        <MonthYearPickerModal
          visible={showPicker}
          date={value ?? new Date()}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          onConfirm={date => {
            closePicker();
            onChange(normalizeDate(date));
          }}
          onCancel={closePicker}
        />
      ) : (
        <BottomSheet
          visible={showPicker}
          onClose={closePicker}
          title={pickerMode === 'monthYear' ? 'Select Month & Year' : label}
          subtitle={
            pickerMode === 'monthYear'
              ? 'Choose a month, then pick a day on the calendar'
              : selectedDate
                ? formatDateOnlyDisplay(parseDateOnly(selectedDate))
                : 'Tap a date (optional)'
          }
          showBack={pickerMode === 'monthYear'}
          onBack={() => setPickerMode('calendar')}
          scrollable={false}
          bodyContentStyle={{paddingHorizontal: 0}}>
          {pickerMode === 'monthYear' ? (
            <MonthYearPickerView
              date={parseMonthStart(visibleMonth)}
              minimumDate={fullMinDate}
              maximumDate={fullMaxDate}
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
                  {formatMonthYearDisplay(parseMonthStart(visibleMonth))}
                </Text>
                <FeatherIcon name="chevron-down" size={18} color={COLORS.teal} />
              </TouchableOpacity>

              <Calendar
                key={visibleMonth}
                markedDates={markedDates}
                onDayPress={day => setSelectedDate(day.dateString)}
                current={visibleMonth}
                hideArrows
                enableSwipeMonths={false}
                renderHeader={() => null}
                minDate={toDateOnlyString(fullMinDate)}
                maxDate={toDateOnlyString(fullMaxDate)}
                style={st.calendar}
                theme={getCalendarTheme(colors)}
              />

              <View style={st.modalActions}>
                <TouchableOpacity onPress={closePicker} style={st.cancelBtn}>
                  <Text style={{color: colors.text, fontSize: 15, fontWeight: '600'}}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    if (selectedDate) {
                      onChange(parseDateOnly(selectedDate));
                    }
                    closePicker();
                  }}
                  style={st.confirmBtn}>
                  <Text style={{color: '#fff', fontSize: 15, fontWeight: '600'}}>
                    {selectedDate ? 'Confirm' : 'Skip'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </BottomSheet>
      )}
    </View>
  );
};

const st = StyleSheet.create({
  label: {
    ...FONTS.font,
    fontSize: 13,
    marginTop: 10,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: SIZES.radius,
    paddingHorizontal: 12,
    minHeight: 46,
    borderWidth: 1,
    justifyContent: 'space-between',
  },
  inputText: {
    ...FONTS.font,
    fontSize: 14,
    flex: 1,
    paddingVertical: 10,
  },
  clearBtn: {
    width: 46,
    height: 46,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
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
  calendar: {
    backgroundColor: 'transparent',
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

export default OptionalDateField;
