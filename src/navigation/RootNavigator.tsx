import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  LinkingOptions,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';

import { SplashScreen } from '@/screens/SplashScreen';
import { AuthScreen } from '@/screens/AuthScreen';
import { HomeScreen } from '@/screens/HomeScreen';
import { CoachesScreen } from '@/screens/CoachesScreen';
import { CoachDetailScreen } from '@/screens/CoachDetailScreen';
import { EnquiryScreen } from '@/screens/EnquiryScreen';
import { EnquirySuccessScreen } from '@/screens/EnquirySuccessScreen';
import { AccountScreen } from '@/screens/AccountScreen';
import { AboutScreen } from '@/screens/AboutScreen';
import { useTheme } from '@/theme';
import { useAuth } from '@/services/auth';
import type { Coach, Enquiry } from '@/types';

type RootStackParamList = {
  Tabs: undefined;
  CoachDetail: { coach: Coach };
  Enquiry: { coach?: Coach; presetType?: Enquiry['type'] };
  EnquirySuccess: undefined;
};

type TabParamList = {
  Home: undefined;
  Roster: undefined;
  About: undefined;
  Account: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

/** Deep linking configuration for the humnsprt:// scheme. */
const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL('/'), 'humnsprt://'],
  config: {
    screens: {
      Tabs: {
        screens: {
          Home: '',
          Roster: 'roster',
          About: 'about',
          Account: 'account',
        },
      },
      CoachDetail: 'coach/:id',
      Enquiry: 'enquiry',
      EnquirySuccess: 'enquiry/success',
    },
  },
};

function Tabs() {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.text,
        tabBarInactiveTintColor: theme.colors.textSubtle,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: Platform.OS === 'ios' ? 84 : 68,
          paddingTop: 10,
          paddingBottom: Platform.OS === 'ios' ? 24 : 10,
        },
        tabBarLabelStyle: {
          fontFamily: theme.fonts.sansMedium,
          fontSize: 10,
          letterSpacing: 1.6,
          textTransform: 'uppercase',
        },
        tabBarIcon: ({ color, size }) => {
          let icon: keyof typeof Ionicons.glyphMap = 'sparkles-outline';
          if (route.name === 'Roster') icon = 'people-outline';
          else if (route.name === 'About') icon = 'information-circle-outline';
          else if (route.name === 'Account') icon = 'person-outline';
          return <Ionicons name={icon} size={size - 2} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home">
        {({ navigation }) => (
          <HomeScreen
            onOpenCoach={(coach) =>
              navigation.getParent()?.navigate('CoachDetail', { coach })
            }
            onOpenAll={() => navigation.navigate('Roster')}
            onOpenConcierge={() =>
              navigation
                .getParent()
                ?.navigate('Enquiry', { presetType: 'concierge' })
            }
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Roster">
        {({ navigation }) => (
          <CoachesScreen
            onOpenCoach={(coach) =>
              navigation.getParent()?.navigate('CoachDetail', { coach })
            }
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="About" component={AboutScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}

const AuthStackNav = createNativeStackNavigator();

function AuthStack() {
  return (
    <AuthStackNav.Navigator
      screenOptions={{ headerShown: false, animation: 'fade' }}
    >
      <AuthStackNav.Screen name="Auth" component={AuthScreen} />
    </AuthStackNav.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        contentStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Screen name="Tabs" component={Tabs} />
      <Stack.Screen
        name="CoachDetail"
        options={{ animation: 'slide_from_right' }}
      >
        {({ navigation, route }) => (
          <CoachDetailScreen
            coach={route.params.coach}
            onBack={() => navigation.goBack()}
            onEnquire={(coach) => navigation.navigate('Enquiry', { coach })}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="Enquiry"
        options={{ animation: 'slide_from_bottom' }}
      >
        {({ navigation, route }) => (
          <EnquiryScreen
            coach={route.params?.coach}
            presetType={route.params?.presetType}
            onBack={() => navigation.goBack()}
            onSuccess={() => navigation.replace('EnquirySuccess')}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="EnquirySuccess">
        {({ navigation }) => (
          <EnquirySuccessScreen onDone={() => navigation.popToTop()} />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

/**
 * Root navigator.
 *
 * Orchestrates the splash -> (auth | app) cross-fade. The splash
 * overlays everything until `splashDone`, then fades out while the
 * next screen is already mounted beneath — no hard cut.
 */
export function RootNavigator() {
  const theme = useTheme();
  const { user, loading } = useAuth();
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    // Safety net: never get stuck on splash longer than 6s.
    const t = setTimeout(() => setSplashDone(true), 6000);
    return () => clearTimeout(t);
  }, []);

  const navTheme = theme.isDark
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: theme.colors.background,
          card: theme.colors.background,
          text: theme.colors.text,
          border: theme.colors.border,
          primary: theme.colors.accent,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: theme.colors.background,
          card: theme.colors.background,
          text: theme.colors.text,
          border: theme.colors.border,
          primary: theme.colors.accent,
        },
      };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <NavigationContainer theme={navTheme} linking={linking}>
        {loading ? null : user ? <AppStack /> : <AuthStack />}
      </NavigationContainer>
      {!splashDone && (
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          <SplashScreen onFinish={() => setSplashDone(true)} />
        </View>
      )}
    </View>
  );
}
