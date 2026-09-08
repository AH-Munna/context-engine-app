import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useTheme} from '@react-navigation/native';
import {FONTS} from '../constants/theme';

export interface DateTimePickerInputProps {
  value: Date | null;
  onChange: (date: Date) => void;
  mode: 'date' | 'time';
  placeholder: string;
  icon: React.ReactNode;
}

const DateTimePickerInput: React.FC<DateTimePickerInputProps> = ({
  value,
  onChange,
  mode,
  placeholder,
  icon,
}) => {
  const theme = useTheme();
  const {colors}: {colors: any} = theme;
  const [visible, setVisible] = React.useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles(colors).row}
        onPress={() => setVisible(true)}>
        <Text style={styles(colors).text}>
          {value
            ? mode === 'date'
              ? value.toLocaleDateString()
              : value.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
            : placeholder}
        </Text>
        <View style={{marginLeft: 8}}>{icon}</View>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={visible}
        mode={mode}
        date={value || new Date()}
        onConfirm={d => {
          setVisible(false);
          onChange(d);
        }}
        onCancel={() => setVisible(false)}
        display="default"
      />
    </>
  );
};

const styles = (colors: any) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border || '#eee',
      paddingHorizontal: 12,
      marginBottom: 10,
      height: 44,
      justifyContent: 'space-between',
    },
    text: {
      ...FONTS.font,
      color: colors.title,
      fontSize: 15,
    },
  });

export default DateTimePickerInput;
