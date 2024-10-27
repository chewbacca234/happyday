import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { signOut } from 'firebase/auth';
import { firebaseAuth } from '../firebase/firebase.config';
import { WarningAlert } from './WarningAlert';
import { Image, Text, View } from 'react-native';
import { styles } from '../config';
import { useSelector } from 'react-redux';

export function DrawerContent(props) {
  const user = useSelector(state => state.user);
  // console.log('[DRAWER CONTENT] user:', user);
  // console.log('firebaseAuth current user:', firebaseAuth.currentUser);

  function handleLogout() {
    if (firebaseAuth.currentUser.isAnonymous) {
      WarningAlert(
        'Si tu te déconnecte tu perdras les donnée de ce compte invité !',
        'Me déconecter',
        () => signOut(firebaseAuth),
        'ANNULER',
        () => null
      );
    } else {
      return signOut(firebaseAuth);
    }
  }

  return (
    <DrawerContentScrollView {...props}>
      <View
        style={{
          alignItems: 'center',
          gap: 16,
          marginVertical: 16,
        }}
      >
        <Image
          style={{
            height: 90,
            width: 90,
            resizeMode: 'cover',
            borderRadius: 50,
          }}
          source={{ uri: user.picture ? user.picture : user.avatar }}
          resizeMethod="resize"
        />
        <Text style={styles.secondaryTitle}>{user.username}</Text>
      </View>
      <DrawerItemList {...props} />
      <DrawerItem
        icon={({ focused, color, size }) => (
          <FontAwesome
            color={color}
            size={size}
            name="sign-out-alt"
            light={true}
          />
        )}
        label="Déconnexion"
        onPress={handleLogout}
        style={{ marginTop: 32, paddingLeft: 8 }}
        labelStyle={{ marginLeft: -24 }}
      />
    </DrawerContentScrollView>
  );
}
