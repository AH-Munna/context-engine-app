import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS, FONTS} from '../../constants/theme';
import BottomSheet from './BottomSheet';

export type ConfirmBottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  /** When set, used for cancel / swipe dismiss instead of onClose. */
  onCancel?: () => void;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  icon?: string;
  onConfirm: () => void;
};

const ConfirmBottomSheet = ({
  visible,
  onClose,
  onCancel,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  destructive = false,
  icon = 'alert-circle-outline',
  onConfirm,
}: ConfirmBottomSheetProps) => {
  const theme = useTheme();
  const {colors}: {colors: any} = theme;

  const handleDismiss = () => {
    if (onCancel) {
      onCancel();
      return;
    }
    onClose();
  };

  const handleConfirm = () => {
    onClose();
    onConfirm();
  };

  const accent = destructive ? COLORS.danger : COLORS.teal;

  return (
    <BottomSheet
      visible={visible}
      onClose={handleDismiss}
      title={title}
      scrollable={false}>
      <View style={st.confirmBlock}>
        <View style={[st.confirmIconWrap, {backgroundColor: `${accent}18`}]}>
          <MaterialIcon name={icon} size={28} color={accent} />
        </View>
        <Text style={[st.confirmBody, {color: colors.textLight}]}>{message}</Text>
        <TouchableOpacity
          style={[st.confirmPrimaryBtn, {backgroundColor: accent}]}
          onPress={handleConfirm}
          activeOpacity={0.85}>
          <Text style={st.confirmPrimaryText}>{confirmLabel}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={st.confirmSecondaryBtn}
          onPress={handleDismiss}
          activeOpacity={0.85}>
          <Text style={[st.confirmSecondaryText, {color: colors.text}]}>
            {cancelLabel}
          </Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
};

const st = StyleSheet.create({
  confirmBlock: {
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 4,
  },
  confirmIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  confirmBody: {
    ...FONTS.font,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  confirmPrimaryBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  confirmPrimaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  confirmSecondaryBtn: {
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
  },
  confirmSecondaryText: {
    ...FONTS.fontBold,
    fontSize: 15,
  },
});

export default ConfirmBottomSheet;
