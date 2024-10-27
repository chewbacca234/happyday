import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles, colors, headerHeight } from '../config';

export function TopBar({ navigation, route }) {
  const safeInsetTop = useSafeAreaInsets().top;

  function getHeaderTitle(route) {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';

    if (route.name === 'Profile') {
      return 'Profil';
    } else if (route.name === 'Help') {
      return 'Aide';
    } else if (route.name === 'Accessibility') {
      return "Paramètres d'accessibilité";
    } else {
      switch (routeName) {
        case 'ChallengeTabNavigator':
          return 'Les Défis';
        case 'MyFriends':
          return 'Mes amis';
        case 'Home':
          return 'Accueil';
        case 'RewardsList':
          return 'Récompenses';
        case 'MyBattles':
          return 'Mes Battles';
      }
    }
  }

  return (
    <View style={{ ...topBarStyles.container, marginTop: safeInsetTop }}>
      <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
        <Ionicons name="menu-outline" size={30} color={colors.white} />
      </TouchableOpacity>
      <Text style={styles.primarySubtitle}>{getHeaderTitle(route)}</Text>
    </View>
  );
}

const topBarStyles = StyleSheet.create({
  container: {
    width: '100%',
    height: headerHeight,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 16,
    alignItems: 'center',
    paddingHorizontal: 16,
    position: 'absolute',
    backgroundColor: colors.transpWhite20,
  },
});
