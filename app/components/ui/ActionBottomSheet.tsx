import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS, FONTS} from '../../constants/theme';
import BottomSheet from './BottomSheet';

export type ActionSheetOption = {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  iconColor?: string;
  iconBg?: string;
  destructive?: boolean;
  onPress: () => void;
};

export type ActionBottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  options: ActionSheetOption[];
};

const ActionBottomSheet = ({
  visible,
  onClose,
  title,
  subtitle,
  options,
}: ActionBottomSheetProps) => {
  const theme = useTheme();
  const {colors, dark}: {colors: any; dark: boolean} = theme;

  const handlePress = (option: ActionSheetOption) => {
    onClose();
    option.onPress();
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      scrollable={options.length > 4}>
      <View style={st.optionsList}>
        {options.map(option => (
          <TouchableOpacity
            key={option.id}
            style={[
              st.optionRow,
              {
                backgroundColor: dark ? '#1A1A1A' : '#FFFFFF',
                borderColor: colors.border || '#E8E4DC',
              },
            ]}
            onPress={() => handlePress(option)}
            activeOpacity={0.85}>
            {option.icon ? (
              <View
                style={[
                  st.optionIconWrap,
                  {
                    backgroundColor:
                      option.iconBg ||
                      (dark ? '#2C2C2E' : '#F2EFE9'),
                  },
                ]}>
                <MaterialIcon
                  name={option.icon}
                  size={20}
                  color={option.iconColor || colors.title}
                />
              </View>
            ) : null}
            <View style={st.optionCopy}>
              <Text
                style={[
                  st.optionLabel,
                  {
                    color: option.destructive ? COLORS.danger : colors.title,
                  },
                ]}>
                {option.label}
              </Text>
              {option.description ? (
                <Text style={[st.optionDescription, {color: colors.textLight}]}>
                  {option.description}
                </Text>
              ) : null}
            </View>
            <FeatherIcon
              name="chevron-right"
              size={18}
              color={colors.textLight || '#989899'}
            />
          </TouchableOpacity>
        ))}
      </View>
    </BottomSheet>
  );
};

const st = StyleSheet.create({
  optionsList: {
    gap: 10,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  optionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionCopy: {
    flex: 1,
    gap: 2,
  },
  optionLabel: {
    ...FONTS.fontBold,
    fontSize: 15,
  },
  optionDescription: {
    ...FONTS.font,
    fontSize: 12,
    lineHeight: 16,
  },
});

export default ActionBottomSheet;
