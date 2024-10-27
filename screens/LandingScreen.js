import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';

import LoginScreen from './AuthScreens/LoginScreen';
import SigninScreen from './AuthScreens/SigninScreen';
import SignupScreen from './AuthScreens/SignupScreen';
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';
import MyFriendsScreen from './FriendsScreens/MyFriendsScreen';
import AllChallengesScreen from './ChallengesScreens/AllChallengesScreen';
import MyChallengesScreen from './ChallengesScreens/MyChallengesScreen';
import FamilyChallengesScreen from './ChallengesScreens/FamilyChallengesScreen';
import RewardsListScreen from './RewardsScreens/RewardsListScreen';
import MyBattlesScreen from './BattlesScreens/MyBattlesScreen';
import HelpScreen from './HelpScreen';

import { TopBar, DrawerContent } from '../components';
import { styles, colors, bottomBarHeight } from '../config';
import AccessibilityScreen from './AccessibilityScreen';
import { firebaseAuth } from '../firebase/firebase.config';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import AnonymousSigninScreen from './AuthScreens/AnonymousSigninScreen';
import { getDailyChallenge } from '../helpers/getDailyChallenge';
import { useDispatch, useSelector } from 'react-redux';
import { setDailyChallenge } from '../reducers/dailyChallenge';
import { getDailyChallengeFromFirestore } from '../helpers/getDailyChallengeFromFirestore';
import areSameDays from '../helpers/areSameDays';

SplashScreen.preventAutoHideAsync();

const BottomTab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const ChallengeTabNavigator = ({ route }) => {
  return (
    <TopTab.Navigator
      initialRouteName={route.params.routeName}
      sceneContainerStyle={{ backgroundColor: 'transparent' }}
      tabBarPosition="bottom"
      screenOptions={{ headerShown: false }}
    >
      <TopTab.Screen
        name="AllChallenges"
        component={AllChallengesScreen}
        options={{ tabBarLabel: 'Tous les Défis' }}
      />
      <TopTab.Screen
        name="MyChallenges"
        component={MyChallengesScreen}
        options={{ tabBarLabel: 'Mes Défis' }}
      />
      <TopTab.Screen
        name="FamilyChallenges"
        component={FamilyChallengesScreen}
        options={{
          title: 'Les Réalisations de la HappyFamily',
          tabBarLabel: 'HappyFamily',
        }}
      />
    </TopTab.Navigator>
  );
};

const BottomTabNavigator = ({ route }) => {
  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarLabel: route.title,
        headerShown: false,
        tabBarStyle: { height: bottomBarHeight },
        tabBarIcon: ({ color, size }) => {
          let iconName = '';

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'MyFriends') {
            iconName = 'users';
          } else if (route.name === 'ChallengeTabNavigator') {
            iconName = 'clipboard-list';
          } else if (route.name === 'RewardsList') {
            iconName = 'trophy';
          } else if (route.name === 'MyBattles') {
            iconName = 'skull-crossbones';
          }
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarLabelStyle: { marginBottom: 4 },
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Accueil' }}
      />
      <BottomTab.Screen
        name="MyFriends"
        component={MyFriendsScreen}
        options={{ title: 'Mes Amis' }}
      />
      <BottomTab.Screen
        name="ChallengeTabNavigator"
        component={ChallengeTabNavigator}
        initialParams={{ routeName: route.params.routeName }}
        options={{ title: 'Défis' }}
      />
      <BottomTab.Screen
        name="RewardsList"
        component={RewardsListScreen}
        options={{ title: 'Récompenses' }}
      />
      <BottomTab.Screen
        name="MyBattles"
        component={MyBattlesScreen}
        options={{ title: 'Mes Battles' }}
      />
    </BottomTab.Navigator>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="BottomTabNavigator"
      drawerContent={props => <DrawerContent {...props} />}
      screenOptions={{
        header: props => <TopBar {...props} />,
        headerShown: true,
        drawerActiveTintColor: colors.darkGrey,
        drawerInactiveTintColor: colors.darkGrey,
        drawerActiveBackgroundColor: 'transparent',
        drawerItemStyle: {
          borderRadius: 50,
          paddingLeft: 8,
          paddingVertical: 0,
          marginVertical: 0,
        },
        drawerType: 'front',
        drawerStyle: {
          backgroundColor: '#c6cbef',
          width: '60%',
          height: '100%',
          borderBottomRightRadius: 150,
          paddingTop: 30,
        },
        drawerContentContainerStyle: {
          flex: 1,
        },
      }}
    >
      <Drawer.Screen
        name="DrawerHome"
        component={BottomTabNavigator}
        options={{ drawerLabel: 'Accueil', title: 'Accueil' }}
        initialParams={{ screen: 'Home' }}
      />
      <Drawer.Screen
        name="DrawerMyFriends"
        component={BottomTabNavigator}
        options={{ drawerLabel: 'Mes Amis', title: 'Mes Amis' }}
        initialParams={{ screen: 'MyFriends' }}
      />
      <Drawer.Screen
        name="DrawerMyChallenges"
        component={BottomTabNavigator}
        options={{ drawerLabel: 'Mes Défis', title: 'Mes Défis' }}
        initialParams={{
          screen: 'ChallengeTabNavigator',
          routeName: 'MyChallenges',
        }}
      />
      <Drawer.Screen
        name="DrawerAllChallenges"
        component={BottomTabNavigator}
        options={{ drawerLabel: 'Tous les défis', title: 'Tous les défis' }}
        initialParams={{
          screen: 'ChallengeTabNavigator',
          routeName: 'AllChallenges',
        }}
      />
      <Drawer.Screen
        name="DrawerFamilyChallenges"
        component={BottomTabNavigator}
        options={{
          drawerLabel: 'Les victoires de la Family',
          title: 'Les victoires de la Family',
        }}
        initialParams={{
          screen: 'ChallengeTabNavigator',
          routeName: 'FamilyChallenges',
        }}
      />
      <Drawer.Screen
        name="DrawerMyBattles"
        component={BottomTabNavigator}
        options={{ drawerLabel: 'Mes Battles', title: 'Mes Battles' }}
        initialParams={{ screen: 'MyBattles' }}
      />
      <Drawer.Screen
        name="DrawerRewards"
        component={BottomTabNavigator}
        options={{ drawerLabel: 'Récompenses', title: 'Récompenses' }}
        initialParams={{ screen: 'RewardsList' }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ drawerLabel: 'Profil', title: 'Profil' }}
      />
      <Drawer.Screen
        name="Help"
        component={HelpScreen}
        options={{ drawerLabel: 'Aide', title: 'Aide' }}
      />
      <Drawer.Screen
        name="Accessibility"
        component={AccessibilityScreen}
        options={{
          drawerLabel: "Paramètres d'accessibilité",
          title: 'Accessibilité',
        }}
      />
    </Drawer.Navigator>
  );
};

export default function LandingScreen() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const dailyChallenge = useSelector(state => state.dailyChallenge.value);

  console.log('[LANDING SCREEN] dailyChallenge', dailyChallenge);

  useEffect(() => {
    (async () => {
      const newDailyChallenge = await getDailyChallengeFromFirestore();
      console.log('newDailyChallenge', newDailyChallenge);

      // UPDATE Redux daily challenge if necessary
      if (
        !areSameDays([
          newDailyChallenge.lastUpdate,
          dailyChallenge.lastUpdate
            ? new Date(dailyChallenge.lastUpdate)
            : null,
        ])
      ) {
        dispatch(setDailyChallenge(newDailyChallenge));
      }
    })();
  }, []);

  onAuthStateChanged(firebaseAuth, async user => {
    // setLoading(true);
    if (!user) {
      // setLoading(false);
      setIsAuthenticated(false);
      await SplashScreen.hideAsync();
    } else {
      // setLoading(false);
      setIsAuthenticated(true);
      await SplashScreen.hideAsync();
    }
  });

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signin" component={SigninScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen
              name="AnonymousSignup"
              component={AnonymousSigninScreen}
            />
          </>
        ) : (
          <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
