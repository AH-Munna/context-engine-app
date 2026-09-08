import React, {useMemo, useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
  Keyboard,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {FONTS, COLORS, SIZES, getThemedDivider} from '../../constants/theme';
import {
  IsoCountry,
  ISO_COUNTRIES,
  searchIsoCountries,
} from '../../constants/isoCountries';

const POPULAR_COUNTRY_ALPHA3 = [
  'USA',
  'GBR',
  'FRA',
  'DEU',
  'ESP',
  'ITA',
  'JPN',
  'AUS',
  'CAN',
  'MEX',
  'BRA',
  'IND',
  'THA',
  'PRT',
  'NLD',
  'ZAF',
  'ARE',
  'SGP',
];

export type CountryPickerContentProps = {
  value?: IsoCountry | null;
  onSelect: (country: IsoCountry) => void;
  excludeAlpha3?: string[];
  placeholderTextColor?: string;
  autoFocus?: boolean;
};

const CountryPickerContent: React.FC<CountryPickerContentProps> = ({
  value = null,
  onSelect,
  excludeAlpha3 = [],
  placeholderTextColor,
  autoFocus = true,
}) => {
  const theme = useTheme();
  const {colors}: {colors: any} = theme;
  const st = styles(colors, theme.dark);
  const [searchText, setSearchText] = useState('');

  const excluded = useMemo(
    () => new Set(excludeAlpha3.map(c => c.toUpperCase())),
    [excludeAlpha3],
  );

  const displayCountries = useMemo(() => {
    const limit = searchText.trim().length >= 1 ? 50 : ISO_COUNTRIES.length;
    const results = searchIsoCountries(searchText, limit).filter(
      c => !excluded.has(c.alpha3),
    );
    if (searchText.trim().length >= 1) {
      return results;
    }
    const popular = POPULAR_COUNTRY_ALPHA3.map(code =>
      searchIsoCountries(code, 1).find(c => c.alpha3 === code),
    ).filter((c): c is IsoCountry => !!c && !excluded.has(c.alpha3));
    const rest = results.filter(c => !popular.some(p => p.alpha3 === c.alpha3));
    return [...popular, ...rest];
  }, [searchText, excluded]);

  const handleSelect = (country: IsoCountry) => {
    Keyboard.dismiss();
    onSelect(country);
    setSearchText('');
  };

  return (
    <View style={st.root}>
      <View style={st.searchContainer}>
        <FeatherIcon
          name="search"
          size={18}
          color={colors.text + '99'}
          style={st.searchIcon}
        />
        <TextInput
          style={st.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search country..."
          placeholderTextColor={placeholderTextColor || colors.text + '99'}
          autoFocus={autoFocus}
          autoCorrect={false}
          returnKeyType="search"
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <FeatherIcon name="x-circle" size={18} color={colors.text + '99'} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={displayCountries}
        keyExtractor={item => item.alpha3}
        style={st.list}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
        showsVerticalScrollIndicator
        ListHeaderComponent={
          <View style={st.listHeaderSlot}>
            {searchText.trim().length < 1 ? (
              <Text style={st.sectionHeader}>Popular countries</Text>
            ) : null}
          </View>
        }
        renderItem={({item}) => {
          const selected = value?.alpha3 === item.alpha3;
          return (
            <TouchableOpacity
              style={[st.item, selected && st.selectedItem]}
              onPress={() => handleSelect(item)}>
              <View style={st.itemRow}>
                <Text style={st.flag}>{item.flag}</Text>
                <View style={st.itemTextWrap}>
                  <Text style={[st.itemText, selected && st.selectedItemText]}>
                    {item.name}
                  </Text>
                  <Text style={st.itemCode}>{item.alpha3}</Text>
                </View>
              </View>
              {selected && (
                <FeatherIcon name="check" size={18} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={st.emptyContainer}>
            <Text style={st.emptyText}>No countries found</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = (colors: any, isDark: boolean) =>
  StyleSheet.create({
    root: {
      flex: 1,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background || '#f5f5f5',
      borderRadius: SIZES.radius,
      marginHorizontal: 16,
      marginBottom: 8,
      paddingHorizontal: 12,
      height: 44,
    },
    searchIcon: {marginRight: 8},
    searchInput: {
      ...FONTS.font,
      fontSize: 15,
      color: colors.title,
      flex: 1,
      height: '100%',
      paddingVertical: 0,
    },
    list: {
      flex: 1,
    },
    listHeaderSlot: {
      minHeight: 36,
      justifyContent: 'center',
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderBottomWidth: isDark ? 0 : 1,
      borderBottomColor: isDark ? 'transparent' : getThemedDivider(false),
    },
    itemRow: {flexDirection: 'row', alignItems: 'center', flex: 1, gap: 10},
    flag: {fontSize: 18},
    itemTextWrap: {flex: 1},
    itemText: {
      ...FONTS.font,
      fontSize: 15,
      color: colors.title,
    },
    itemCode: {
      ...FONTS.font,
      fontSize: 12,
      color: colors.textLight,
      marginTop: 2,
    },
    selectedItem: {backgroundColor: COLORS.primary + '08'},
    selectedItemText: {color: COLORS.primary, fontWeight: '600'},
    emptyContainer: {paddingVertical: 40, alignItems: 'center'},
    emptyText: {
      ...FONTS.font,
      fontSize: 15,
      color: colors.text,
      opacity: 0.6,
    },
    sectionHeader: {
      ...FONTS.font,
      fontSize: 12,
      color: colors.text + '99',
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 6,
      fontWeight: '600',
    },
  });

export default CountryPickerContent;
