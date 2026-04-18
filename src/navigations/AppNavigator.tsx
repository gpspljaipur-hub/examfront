import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from "../Screens/SplashScreen";
import Login from "../Screens/Login";
import OTPScreen from "../Screens/OTPScreen";
import SelectLanguage from "../Screens/SelectLanguage";
import SelectClass from "../Screens/SelectClass";
import SelectBoard from "../Screens/SelectBoard";
import Dashboard from "../Screens/Dashboard";
import ProgressScreen from "../Screens/ProgressScreen";
import ChatScreen from "../Screens/ChatScreen";



export type RootStackParamList = {
    SplashScreen: undefined;
    Login: undefined;
    OTPScreen: { mobile: string };
    SelectLanguage: undefined;
    SelectClass: undefined;
    SelectBoard: undefined;
    Dashboard: undefined;
    ProgressScreen: undefined;
    ChatScreen: undefined;
};


const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="SplashScreen" component={SplashScreen} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="OTPScreen" component={OTPScreen} />
                <Stack.Screen name="SelectLanguage" component={SelectLanguage} />
                <Stack.Screen name="SelectClass" component={SelectClass} />
                <Stack.Screen name="SelectBoard" component={SelectBoard} />
                <Stack.Screen name="Dashboard" component={Dashboard} />
                <Stack.Screen name="ProgressScreen" component={ProgressScreen} />
                <Stack.Screen name="ChatScreen" component={ChatScreen} />

            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
