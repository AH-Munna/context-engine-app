import * as React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {SvgXml} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {COLORS, FONTS, ICONS, SIZES} from '../constants/theme';
import SoftShadow from '../components/ui/SoftShadow';
import {getHeaderShadowStyle} from '../constants/shadows';

const Header = (props: any) => {
  const theme = useTheme();
  const {colors}: {colors: any} = theme;
  const headerShadow = getHeaderShadowStyle(!!props.bgWhite);

  const navigation = useNavigation<any>();
  const unreadNotifications = props.unreadNotifications ?? 0;

  return (
    <>
      <View
        style={[
          props.transparent && {
            position: 'absolute',
            zIndex: 1,
            width: '100%',
          },
        ]}>
        <SoftShadow
          disabled={!props.bgWhite}
          shadowColor={headerShadow.shadowColor}
          shadowOffset={headerShadow.shadowOffset}
          shadowOpacity={headerShadow.shadowOpacity}
          shadowRadius={headerShadow.shadowRadius}
          backgroundColor={props.bgWhite ? colors.card : 'transparent'}
          style={{
            backgroundColor: props.bgWhite ? colors.card : 'transparent',
          }}>
          <View
            style={[
              {
                paddingHorizontal: 15,
                paddingVertical: 8,
                flexDirection: 'row',
                alignItems: 'center',
                borderBottomWidth: 1,
                borderColor: colors.borderColor,
              },
              props.transparent && {
                borderBottomWidth: 0,
              },
              props.bgWhite && {
                backgroundColor: colors.card,
                borderBottomWidth: 0,
                zIndex: 1,
              },
            ]}>
            {props.sideMenu && (
              <TouchableOpacity
                onPress={() => navigation.navigate('Settings')}
                style={{
                  height: 45,
                  width: 45,
                  marginRight: 5,
                  marginLeft: -8,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <FeatherIcon color={colors.title} size={22} name="menu" />
              </TouchableOpacity>
            )}
            {props.leftIcon === 'close' && (
              <TouchableOpacity
                accessible={true}
                accessibilityLabel="Go back"
                accessibilityHint="Navigates to the previous screen"
                onPress={() => navigation.goBack()}
                style={{
                  height: 45,
                  width: 45,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: SIZES.radius,
                  marginRight: 10,
                }}>
                <SvgXml
                  height={30}
                  width={30}
                  stroke={colors.title}
                  xml={ICONS.close}
                />
              </TouchableOpacity>
            )}
            {props.leftIcon === 'back' && (
              <TouchableOpacity
                onPress={() => {
                  props.backNavigate
                    ? navigation.navigate(props.backNavigate)
                    : navigation.goBack();
                }}
                style={{
                  height: 45,
                  width: 45,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: SIZES.radius,
                  marginRight: 10,
                }}>
                <MaterialIcons
                  name="arrow-back"
                  color={props.bgImage ? COLORS.white : colors.title}
                  size={22}
                />
              </TouchableOpacity>
            )}
            {props.brandTitle ? (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  height: 45,
                  marginRight: 8,
                }}>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.72}
                  style={[
                    {
                      flexShrink: 1,
                      fontFamily: 'Poppins-Bold',
                      fontSize: 20,
                      color: theme.dark ? '#fff' : COLORS.darkTeal,
                      letterSpacing: 0.4,
                      includeFontPadding: false,
                      textAlignVertical: 'center',
                    },
                    props.bgImage && {color: COLORS.white},
                  ]}>
                  Context{' '}
                  <Text style={{color: COLORS.primary}}>Engine</Text>
                </Text>
              </View>
            ) : (
              <Text
                style={[
                  FONTS.h4,
                  {color: colors.title, flex: 1},
                  props.bgImage && {color: COLORS.white},
                  props.titleCenter && {textAlign: 'center', marginRight: 55},
                ]}>
                {props.title}
              </Text>
            )}
            {props.rightIcon2 === 'pages' && (
              <TouchableOpacity
                onPress={() => props.onPressPages && props.onPressPages()}
                style={{
                  height: 45,
                  width: 45,
                  marginRight: 10,
                  backgroundColor: props.bgImage
                    ? 'rgba(255,255,255,.15)'
                    : COLORS.primayLight,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: SIZES.radius,
                }}>
                <FeatherIcon
                  name="file"
                  color={props.bgImage ? COLORS.white : colors.title}
                  size={22}
                />
              </TouchableOpacity>
            )}

            {props.showEdit && (
              <TouchableOpacity
                accessible={true}
                accessibilityLabel={props.editActive ? 'Done editing profile' : 'Edit profile'}
                accessibilityHint="Opens the edit profile screen"
                onPress={() => props.onPressEdit && props.onPressEdit()}
                style={{
                  height: 45,
                  width: 45,
                  marginRight: 4,
                  backgroundColor: props.editActive ? COLORS.teal : COLORS.primayLight,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: SIZES.radius,
                }}>
                <FeatherIcon
                  name="edit-2"
                  size={20}
                  color={props.editActive ? COLORS.white : colors.title}
                />
              </TouchableOpacity>
            )}

            {props.rightIcon === 'notification' && (
              <TouchableOpacity
                accessible={true}
                accessibilityLabel="Notifications"
                accessibilityHint="show notifications"
                onPress={() => {
                  if (props.onPressNotification) {
                    props.onPressNotification();
                  } else {
                    navigation.navigate('Notifications');
                  }
                }}
                style={{
                  height: 45,
                  width: 45,
                  marginRight: props.rightIcon2 ? 4 : 0,
                  backgroundColor: COLORS.primayLight,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: SIZES.radius,
                }}>
                {unreadNotifications > 0 && (
                  <View
                    style={{
                      height: 10,
                      width: 10,
                      backgroundColor: COLORS.secondary,
                      borderRadius: 5,
                      borderWidth: 2,
                      borderColor: '#FEEADF',
                      position: 'absolute',
                      top: 10,
                      right: 12,
                      zIndex: 1,
                    }}
                  />
                )}
                <SvgXml fill={colors.title} xml={ICONS.notification} />
              </TouchableOpacity>
            )}
            {props.rightIcon === 'settings' && (
              <TouchableOpacity
                onPress={() => {
                  if (props.onPressSettings) {
                    props.onPressSettings();
                  } else {
                    navigation.navigate('Settings');
                  }
                }}
                style={{
                  height: 45,
                  width: 45,
                  backgroundColor: props.bgImage
                    ? 'rgba(255,255,255,.15)'
                    : COLORS.primayLight,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: SIZES.radius,
                }}>
                <SvgXml
                  stroke={props.bgImage ? COLORS.white : colors.title}
                  xml={ICONS.settings}
                />
              </TouchableOpacity>
            )}

            {props.rightIcon === 'search' && (
              <TouchableOpacity
                onPress={() => props.onPressSearch && props.onPressSearch()}
                style={{
                  height: 45,
                  width: 45,
                  backgroundColor: props.bgImage
                    ? 'rgba(255,255,255,.15)'
                    : COLORS.primayLight,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: SIZES.radius,
                }}>
                <SvgXml
                  fill={props.bgImage ? COLORS.white : colors.title}
                  xml={ICONS.search}
                />
              </TouchableOpacity>
            )}

            {props.rightIcon2 === 'info' && (
              <View style={{marginLeft: 10}}>
                <TouchableOpacity
                  onPress={() => props.onPressInfo && props.onPressInfo()}
                  style={{
                    height: 45,
                    width: 45,
                    backgroundColor: props.bgImage
                      ? 'rgba(255,255,255,.15)'
                      : COLORS.primayLight,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: SIZES.radius,
                  }}>
                  <SvgXml
                    height={20}
                    width={20}
                    fill={props.bgImage ? COLORS.white : colors.title}
                    xml={ICONS.info}
                  />
                </TouchableOpacity>
              </View>
            )}

            {props.rightIcon2 === 'settings' && (
              <TouchableOpacity
                onPress={() => navigation.navigate('Settings')}
                style={{
                  height: 45,
                  width: 45,
                  backgroundColor: props.bgImage
                    ? 'rgba(255,255,255,.15)'
                    : COLORS.primayLight,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: SIZES.radius,
                }}>
                <SvgXml
                  stroke={props.bgImage ? COLORS.white : colors.title}
                  xml={ICONS.settings}
                />
              </TouchableOpacity>
            )}

            {props.rightIcon === 'next' && (
              <TouchableOpacity
                style={{
                  height: 45,
                  width: 45,
                  backgroundColor: COLORS.primayLight,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: SIZES.radius,
                }}>
                <SvgXml stroke={colors.title} xml={ICONS.arrowRight} />
              </TouchableOpacity>
            )}
          </View>
        </SoftShadow>
      </View>
    </>
  );
};

export default Header;
