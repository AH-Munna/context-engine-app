import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useTheme} from '@react-navigation/native';
import {Platform, StatusBar, View} from 'react-native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import {RootStackParamList} from './RootStackParamList';
import {useAppSelector} from '../hooks/useRedux';

// Auth Screens
import LoginScreen from '../Screens/Auth/LoginScreen';
import RegisterScreen from '../Screens/Auth/RegisterScreen';
import ForgotPasswordScreen from '../Screens/Auth/ForgotPasswordScreen';

// Onboarding Screens
import ChooseAccountTypeScreen from '../Screens/Onboarding/ChooseAccountTypeScreen';
import CreatorOnboardingScreen from '../Screens/Onboarding/CreatorOnboardingScreen';
import OrganizationOnboardingScreen from '../Screens/Onboarding/OrganizationOnboardingScreen';

// Main application screens
import HomeScreen from '../Screens/Home';
import ComponentsScreen from '../Screens/components';

// Component showcase screens
import AccordionScreen from '../Screens/Components/Accordion';
import ActionSheet from '../Screens/Components/ActionSheet';
import ActionModals from '../Screens/Components/ActionModals';
import Buttons from '../Screens/Components/Buttons';
import Charts from '../Screens/Components/Charts';
import Chips from '../Screens/Components/Chips';
import Cards from '../Screens/Components/Cards';
import Columns from '../Screens/Components/Columns';
import CollapseElements from '../Screens/Components/CollapseElements';
import DividerElements from '../Screens/Components/DividerElements';
import FileUploads from '../Screens/Components/FileUploads';
import Headers from '../Screens/Components/Headers';
import Footers from '../Screens/Components/Footers';
import TabStyle1 from '../components/Footers/FooterStyle1';
import TabStyle2 from '../components/Footers/FooterStyle2';
import TabStyle3 from '../components/Footers/FooterStyle3';
import TabStyle4 from '../components/Footers/FooterStyle4';
import Inputs from '../Screens/Components/Inputs';
import ListScreen from '../Screens/Components/lists';
import Paginations from '../Screens/Components/Paginations';
import Pricings from '../Screens/Components/Pricings';
import CarouselSliders from '../Screens/Components/CarouselSliders';
import Snackbars from '../Screens/Components/Snackbars';
import Socials from '../Screens/Components/Socials';
import Tables from '../Screens/Components/Tables';
import Tabs from '../Screens/Components/Tabs';
import Toggles from '../Screens/Components/Toggles';
import SystemPage from '../Screens/Components/SystemPack/Index';
import SwipeableScreen from '../Screens/Components/Swipeable';

import {resolvePostAuthRoute} from '../utils/accountType';

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigator = () => {
  const theme = useTheme();
  const {isAuthenticated, isOnboarded, accountType, creator} = useAppSelector(
    state => state.app
  );

  React.useEffect(() => {
    if (Platform.OS === 'android') {
      try {
        changeNavigationBarColor(
          String(theme.colors.background),
          !theme.dark,
          true,
        );
      } catch {}
    }
  }, [theme.dark, theme.colors.background]);

  // Determine initial route based on authentication, accountType and onboarding state
  const initialRouteName: keyof RootStackParamList = !isAuthenticated
    ? 'Login'
    : resolvePostAuthRoute({
        accountType,
        hasCreatorProfile: !!creator,
        hasCompletedOrgOnboarding: isOnboarded,
      });

  return (
    <View
      style={{
        width: '100%',
        flex: 1,
        backgroundColor: theme.colors.background,
      }}>
      <StatusBar
        backgroundColor={theme.colors.background}
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        translucent={Platform.OS === 'android' ? false : undefined}
      />
      <Stack.Navigator
        key={isAuthenticated ? 'auth-session' : 'guest-session'}
        initialRouteName={initialRouteName}
        screenOptions={{
          headerShown: false,
        }}>
        {/* Auth Stack */}
        <Stack.Screen name={'Login'} component={LoginScreen} />
        <Stack.Screen name={'Register'} component={RegisterScreen} />
        <Stack.Screen name={'ForgotPassword'} component={ForgotPasswordScreen} />

        {/* Onboarding Stack */}
        <Stack.Screen name={'ChooseAccountType'} component={ChooseAccountTypeScreen} />
        <Stack.Screen name={'CreatorOnboarding'} component={CreatorOnboardingScreen} />
        <Stack.Screen name={'OrgOnboarding'} component={OrganizationOnboardingScreen} />

        {/* Main Application Screen */}
        <Stack.Screen name={'Home'} component={HomeScreen} />

        {/* UI Component Catalog */}
        <Stack.Screen name={'Components'} component={ComponentsScreen} />

        {/* Preserved Reusable Component Showcases */}
        <Stack.Screen name={'Accordion'} component={AccordionScreen} />
        <Stack.Screen name={'ActionSheet'} component={ActionSheet} />
        <Stack.Screen name={'ActionModals'} component={ActionModals} />
        <Stack.Screen name={'Buttons'} component={Buttons} />
        <Stack.Screen name={'Charts'} component={Charts} />
        <Stack.Screen name={'Chips'} component={Chips} />
        <Stack.Screen name={'Cards'} component={Cards} />
        <Stack.Screen name={'Columns'} component={Columns} />
        <Stack.Screen name={'CollapseElements'} component={CollapseElements} />
        <Stack.Screen name={'DividerElements'} component={DividerElements} />
        <Stack.Screen name={'FileUploads'} component={FileUploads} />
        <Stack.Screen name={'Headers'} component={Headers} />
        <Stack.Screen name={'Footers'} component={Footers} />
        <Stack.Screen name={'TabStyle1'} component={TabStyle1} />
        <Stack.Screen name={'TabStyle2'} component={TabStyle2} />
        <Stack.Screen name={'TabStyle3'} component={TabStyle3} />
        <Stack.Screen name={'TabStyle4'} component={TabStyle4} />
        <Stack.Screen name={'Inputs'} component={Inputs} />
        <Stack.Screen name={'lists'} component={ListScreen} />
        <Stack.Screen name={'Paginations'} component={Paginations} />
        <Stack.Screen name={'Pricings'} component={Pricings} />
        <Stack.Screen name={'CarouselSliders'} component={CarouselSliders} />
        <Stack.Screen name={'Snackbars'} component={Snackbars} />
        <Stack.Screen name={'Socials'} component={Socials} />
        <Stack.Screen name={'Swipeable'} component={SwipeableScreen} />
        <Stack.Screen name={'Tabs'} component={Tabs} />
        <Stack.Screen name={'Tables'} component={Tables} />
        <Stack.Screen name={'Toggles'} component={Toggles} />
        <Stack.Screen name={'SystemPage'} component={SystemPage} />
      </Stack.Navigator>
    </View>
  );
};

export default StackNavigator;
