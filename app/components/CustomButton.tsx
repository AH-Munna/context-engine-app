import React from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity} from 'react-native';
import DropShadow from 'react-native-drop-shadow';
import {COLORS, FONTS, SIZES} from '../constants/theme';

const CustomButton = (props: any) => {
  return (
    <DropShadow
      style={[
        {
          shadowColor: COLORS.coral,
          shadowOffset: {
            width: 5,
            height: 5,
          },
          shadowOpacity: props.btnLight ? 0 : props.disabled ? 0 : 0.3,
          shadowRadius: 5,
        },
        Platform.OS === 'ios' && {
          backgroundColor: props.color || COLORS.coral,
          borderRadius: SIZES.radius_md,
        },
      ]}>
      <TouchableOpacity
        disabled={props.disabled}
        activeOpacity={0.75}
        style={[
          {...styles.button},
          props.btnSm && {height: 40},
          props.color && {backgroundColor: props.color},
          props.btnLight && {
            backgroundColor: 'rgba(255,255,255,.12)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,.35)',
            elevation: 0,
            shadowOpacity: 0,
          },
          props.disabled && {
            backgroundColor: '#C9C9C9',
            elevation: 0,
            shadowOpacity: 0,
          },
        ]}
        onPress={() => (props.onPress ? props.onPress() : '')}>
        <Text
          style={[
            {...FONTS.fontLg, color: COLORS.white, ...FONTS.button},
            props.btnLight && {color: COLORS.white},
          ]}>
          {props.title}
        </Text>
      </TouchableOpacity>
    </DropShadow>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: SIZES.radius_md,
    backgroundColor: COLORS.coral,
    alignItems: 'center',
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
});

export default CustomButton;
