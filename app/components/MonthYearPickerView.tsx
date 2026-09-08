import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useTheme} from '@react-navigation/native';
import {COLORS, FONTS} from '../constants/theme';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export interface MonthYearPickerViewProps {
  date: Date;
  onConfirm: (date: Date) => void;
  onCancel?: () => void;
  minimumDate?: Date;
  maximumDate?: Date;
  confirmLabel?: string;
  cancelLabel?: string;
  showCancelButton?: boolean;
}

export function clampMonthYear(
  month: number,
  year: number,
  minimumDate?: Date,
  maximumDate?: Date,
): Date {
  let nextMonth = month;
  let nextYear = year;

  if (minimumDate) {
    const minMonth = minimumDate.getMonth();
    const minYear = minimumDate.getFullYear();
    if (nextYear < minYear || (nextYear === minYear && nextMonth < minMonth)) {
      nextYear = minYear;
      nextMonth = minMonth;
    }
  }

  if (maximumDate) {
    const maxMonth = maximumDate.getMonth();
    const maxYear = maximumDate.getFullYear();
    if (nextYear > maxYear || (nextYear === maxYear && nextMonth > maxMonth)) {
      nextYear = maxYear;
      nextMonth = maxMonth;
    }
  }

  return new Date(nextYear, nextMonth, 1);
}

const MonthYearPickerView: React.FC<MonthYearPickerViewProps> = ({
  date,
  onConfirm,
  onCancel,
  minimumDate,
  maximumDate,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  showCancelButton = false,
}) => {
  const theme = useTheme();
  const {colors}: {colors: any} = theme;
  const [month, setMonth] = useState(date.getMonth());
  const [year, setYear] = useState(date.getFullYear());

  const minYear = minimumDate?.getFullYear() ?? 1950;
  const maxYear = maximumDate?.getFullYear() ?? new Date().getFullYear() + 10;

  const years = useMemo(
    () => Array.from({length: maxYear - minYear + 1}, (_, i) => minYear + i),
    [minYear, maxYear],
  );

  const availableMonths = useMemo(() => {
    let start = 0;
    let end = 11;
    if (year === minYear && minimumDate) {
      start = minimumDate.getMonth();
    }
    if (year === maxYear && maximumDate) {
      end = maximumDate.getMonth();
    }
    return MONTHS.map((label, index) => ({label, index})).filter(
      item => item.index >= start && item.index <= end,
    );
  }, [year, minYear, maxYear, minimumDate, maximumDate]);

  useEffect(() => {
    const initial = clampMonthYear(
      date.getMonth(),
      date.getFullYear(),
      minimumDate,
      maximumDate,
    );
    setMonth(initial.getMonth());
    setYear(initial.getFullYear());
  }, [date, minimumDate, maximumDate]);

  useEffect(() => {
    if (!availableMonths.some(item => item.index === month)) {
      setMonth(availableMonths[0]?.index ?? 0);
    }
  }, [availableMonths, month]);

  return (
    <View>
      <View style={st.pickerRow}>
        <Picker
          selectedValue={month}
          onValueChange={value => setMonth(Number(value))}
          style={st.picker}
          itemStyle={Platform.OS === 'ios' ? st.pickerItem : undefined}>
          {availableMonths.map(item => (
            <Picker.Item
              key={item.index}
              label={item.label}
              value={item.index}
              color={colors.title}
            />
          ))}
        </Picker>
        <Picker
          selectedValue={year}
          onValueChange={value => setYear(Number(value))}
          style={st.picker}
          itemStyle={Platform.OS === 'ios' ? st.pickerItem : undefined}>
          {years.map(y => (
            <Picker.Item
              key={y}
              label={String(y)}
              value={y}
              color={colors.title}
            />
          ))}
        </Picker>
      </View>

      <View style={[st.actions, {borderTopColor: colors.border || '#E0DCD5'}]}>
        <TouchableOpacity
          style={st.actionBtn}
          onPress={() =>
            onConfirm(clampMonthYear(month, year, minimumDate, maximumDate))
          }>
          <Text style={[st.actionText, {color: COLORS.teal}]}>{confirmLabel}</Text>
        </TouchableOpacity>
        {showCancelButton && onCancel ? (
          <TouchableOpacity style={st.actionBtn} onPress={onCancel}>
            <Text style={[st.actionText, {color: COLORS.teal}]}>{cancelLabel}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const st = StyleSheet.create({
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  picker: {
    flex: 1,
    height: Platform.OS === 'ios' ? 216 : 48,
  },
  pickerItem: {
    fontSize: 20,
    height: 216,
  },
  actions: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  actionBtn: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  actionText: {
    ...FONTS.fontBold,
    fontSize: 17,
  },
});

export default MonthYearPickerView;
