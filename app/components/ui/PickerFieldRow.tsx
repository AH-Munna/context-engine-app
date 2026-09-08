import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {FONTS, SIZES} from '../../constants/theme';

export type PickerFieldRowProps = {
  value?: string;
  placeholder: string;
  onPress: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  leading?: React.ReactNode;
  trailingCode?: string;
};

const PickerFieldRow: React.FC<PickerFieldRowProps> = ({
  value,
  placeholder,
  onPress,
  containerStyle,
  leading,
  trailingCode,
}) => {
  const theme = useTheme();
  const {colors}: {colors: any} = theme;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        st.row,
        {
          backgroundColor: colors.card,
          borderColor: colors.border || '#E8E4DC',
        },
        containerStyle,
      ]}>
      <View style={st.content}>
        {leading}
        <Text
          style={[
            st.text,
            {color: value ? colors.title : colors.textLight},
          ]}
          numberOfLines={1}>
          {value || placeholder}
        </Text>
        {trailingCode ? (
          <Text style={[st.code, {color: colors.textLight}]}>{trailingCode}</Text>
        ) : null}
      </View>
      <FeatherIcon name="chevron-right" size={18} color={colors.textLight} />
    </TouchableOpacity>
  );
};

const st = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: SIZES.radius,
    minHeight: 44,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingRight: 8,
  },
  text: {
    ...FONTS.font,
    fontSize: 14,
    flex: 1,
  },
  code: {
    ...FONTS.font,
    fontSize: 12,
  },
});

export default PickerFieldRow;
