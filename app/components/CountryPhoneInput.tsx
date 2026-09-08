import React, {useMemo, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {COLORS, FONTS, SIZES} from '../constants/theme';
import {COUNTRIES, CountryEntry} from '../constants/countries';
import KeyboardBottomSheet from './ui/KeyboardBottomSheet';

interface CountryPhoneInputProps {
  value: string;
  onChangeText: (phone: string) => void;
  onChangeDialCode?: (dialCode: string, countryCode: string) => void;
  placeholder?: string;
}

const DEFAULT_COUNTRY = COUNTRIES.find(c => c.code === 'US')!;

const Separator = () => <View style={styles.separator} />;

const CountryPhoneInput: React.FC<CountryPhoneInputProps> = ({
  value,
  onChangeText,
  onChangeDialCode,
  placeholder = 'Phone number',
}) => {
  const theme = useTheme();
  const {colors}: {colors: any} = theme;
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState<CountryEntry>(DEFAULT_COUNTRY);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) {
      return COUNTRIES;
    }
    const q = query.toLowerCase();
    return COUNTRIES.filter(
      c =>
        c.name.toLowerCase().includes(q) ||
        c.dial.includes(q) ||
        c.code.toLowerCase().includes(q),
    );
  }, [query]);

  const closeModal = () => {
    setModalVisible(false);
    setQuery('');
  };

  const handleSelect = (country: CountryEntry) => {
    setSelected(country);
    onChangeDialCode?.(country.dial, country.code);
    closeModal();
  };

  return (
    <>
      <View style={styles.wrapper}>
        <TouchableOpacity
          style={styles.codeBtn}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.75}>
          <Text style={styles.flag}>{selected.flag}</Text>
          <Text style={styles.dialCode}>{selected.dial}</Text>
          <Text style={styles.chevron}>▾</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={'rgba(255,255,255,.4)'}
          keyboardType="phone-pad"
        />
      </View>

      <KeyboardBottomSheet
        visible={modalVisible}
        onClose={closeModal}
        title="Select Country"
        chromeHeight={150}
        minContentHeight={160}
        scrollable={false}
        bodyContentStyle={{paddingHorizontal: 0, flex: 1}}>
        <View style={[styles.searchBox, {borderColor: colors.border || COLORS.borderColor}]}>
          <FeatherIcon name="search" size={18} color="#999" style={{marginRight: 8}} />
          <TextInput
            style={[styles.searchInput, {color: colors.title}]}
            value={query}
            onChangeText={setQuery}
            placeholder="Search country or dial code..."
            placeholderTextColor="#999"
            autoFocus
            returnKeyType="search"
          />
          {query.length > 0 ? (
            <TouchableOpacity onPress={() => setQuery('')}>
              <FeatherIcon name="x-circle" size={18} color="#999" />
            </TouchableOpacity>
          ) : null}
        </View>

        <FlatList
          data={filtered}
          keyExtractor={item => item.code}
          keyboardShouldPersistTaps="handled"
          initialNumToRender={30}
          style={{flex: 1}}
          renderItem={({item}) => (
            <TouchableOpacity
              style={[
                styles.row,
                item.code === selected.code && styles.rowSelected,
              ]}
              onPress={() => handleSelect(item)}
              activeOpacity={0.7}>
              <Text style={styles.rowFlag}>{item.flag}</Text>
              <Text style={styles.rowName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.rowDial}>{item.dial}</Text>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={Separator}
        />
      </KeyboardBottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: SIZES.radius,
    borderColor: 'rgba(255,255,255,.3)',
    backgroundColor: 'rgba(255,255,255,.07)',
    marginBottom: 15,
    overflow: 'hidden',
  },
  codeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: '100%',
    gap: 4,
  },
  flag: {fontSize: 20},
  dialCode: {...FONTS.fontLg, color: COLORS.white},
  chevron: {fontSize: 10, color: 'rgba(255,255,255,.5)', marginTop: 2},
  divider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,.3)',
    marginHorizontal: 2,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 12,
    ...FONTS.fontLg,
    color: COLORS.white,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    height: 44,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    backgroundColor: COLORS.white,
  },
  searchInput: {
    flex: 1,
    ...FONTS.font,
    height: '100%',
  },
  row: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
  },
  rowSelected: {backgroundColor: '#EFF8F8'},
  rowFlag: {fontSize: 22, marginRight: 12},
  rowName: {flex: 1, ...FONTS.font, color: COLORS.dark},
  rowDial: {
    ...FONTS.fontSm,
    color: COLORS.teal,
    minWidth: 50,
    textAlign: 'right',
  },
  separator: {height: 1, backgroundColor: COLORS.borderColor},
});

export default CountryPhoneInput;
