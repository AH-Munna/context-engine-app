import React from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import Home from './Home';
import Onboarding from './Onboarding';
import SignIn from './SignIn';
import CreateAccount from './CreateAccount';
import ForgotPassword from './ForgotPassword';
import EnterCode from './EnterCode';
import ChangePassword from './ChangePassword';

export type SystemStackParamList = {
  Home: undefined;
  Onboarding: undefined;
  SignIn: undefined;
  CreateAccount: undefined;
  ForgotPassword: undefined;
  EnterCode: undefined;
  ChangePassword: undefined;
};

const Stack = createStackNavigator<SystemStackParamList>();

const SystemPage = () => {
    return (
        <>
            <Stack.Navigator
                initialRouteName={"Home"}
                detachInactiveScreens={true}
                screenOptions={{
                    headerShown: false,
                    cardStyle: { backgroundColor: "transparent" },
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                }}
            >
                <Stack.Screen name={"Home"} component={Home} />
                <Stack.Screen name={"Onboarding"} component={Onboarding} />
                <Stack.Screen name={"SignIn"} component={SignIn} />
                <Stack.Screen name={"CreateAccount"} component={CreateAccount} />
                <Stack.Screen name={"ForgotPassword"} component={ForgotPassword} />
                <Stack.Screen name={"EnterCode"} component={EnterCode} />
                <Stack.Screen name={"ChangePassword"} component={ChangePassword} />
            </Stack.Navigator>
        </>
    );
};

export default SystemPage;