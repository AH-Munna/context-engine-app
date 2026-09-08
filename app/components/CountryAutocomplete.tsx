import React, {useState} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {useTheme} from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {FONTS} from '../constants/theme';
import {IsoCountry} from '../constants/isoCountries';
import KeyboardBottomSheet from './ui/KeyboardBottomSheet';
import CountryPickerContent from './pickers/CountryPickerContent';

export interface CountryAutocompleteProps {
  value: IsoCountry | null;
  onChange: (country: IsoCountry) => void;
  placeholder?: string;
  style?: any;
  placeholderTextColor?: string;
  excludeAlpha3?: string[];
  sheetTitle?: string;
}

const CountryAutocomplete: React.FC<CountryAutocompleteProps> = ({
  value,
  onChange,
  placeholder,
  style,
  placeholderTextColor,
  excludeAlpha3 = [],
  sheetTitle = 'Select Country',
}) => {
  const theme = useTheme();
  const {colors}: {colors: any} = theme;
  const st = styles(colors);
  const [showSheet, setShowSheet] = useState(false);

  const openSheet = () => setShowSheet(true);

  const closeSheet = () => setShowSheet(false);

  const handleSelect = (country: IsoCountry) => {
    onChange(country);
    closeSheet();
  };

  return (
    <View style={[st.container, style]}>
      <TouchableOpacity style={st.inputButton} onPress={openSheet}>
        {value ? (
          <View style={st.selectedRow}>
            <Text style={st.flag}>{value.flag}</Text>
            <Text style={st.inputText}>{value.name}</Text>
            <Text style={st.codeText}>{value.alpha3}</Text>
          </View>
        ) : (
          <Text style={[st.inputText, st.placeholderText]}>
            {placeholder || 'Select country'}
          </Text>
        )}
        <FeatherIcon name="chevron-down" size={18} color={colors.text + '99'} />
      </TouchableOpacity>

      <KeyboardBottomSheet
        visible={showSheet}
        onClose={closeSheet}
        title={sheetTitle}
        chromeHeight={160}
        minContentHeight={280}
        scrollable={false}
        bodyContentStyle={{paddingHorizontal: 0, flex: 1, paddingBottom: 0}}>
        <CountryPickerContent
          value={value}
          onSelect={handleSelect}
          excludeAlpha3={excludeAlpha3}
          placeholderTextColor={placeholderTextColor}
        />
      </KeyboardBottomSheet>
    </View>
  );
};

const styles = (colors: any) =>
  StyleSheet.create({
    container: {flex: 1},
    inputButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      flex: 1,
      height: '100%',
    },
    selectedRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: 8,
    },
    flag: {fontSize: 18},
    inputText: {
      ...FONTS.font,
      fontSize: 15,
      color: colors.title,
      flex: 1,
    },
    codeText: {
      ...FONTS.font,
      fontSize: 12,
      color: colors.textLight,
      marginRight: 8,
    },
    placeholderText: {color: colors.text + '99'},
  });

export default CountryAutocomplete;
